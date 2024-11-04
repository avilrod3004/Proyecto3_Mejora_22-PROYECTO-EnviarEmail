document.addEventListener('DOMContentLoaded', function(){
    // Objetos de datos
    const usuarioIncioSesion = {
        email: "",
        password: ""
    }

    const usuarioNuevo = {
        nombre: "",
        email: "",
        password: ""
    }

    let recibidos = [];
    let enviados = [];

    let usuarioActivo = {
        id: "",
        nombre: "",
        email: "",
        password: ""
    };

    const emailFormulario = {
        emailOrigen: "",
        emailDestino: '',
        asunto: '',
        mensaje: '',
        leido: false
    }

    const emailLeer = {
        id: "",
        emailOrigen: "",
        emailDestino: '',
        asunto: '',
        mensaje: '',
        leido: true
    }

    const body = document.querySelector("body");

    // Elementos de los formularios
    const inputNombre = document.querySelector("#nombre")
    const inputEmail = document.querySelector('#email')
    const inputEmailDestino = document.querySelector('#emailDestino')
    const inputAsunto = document.querySelector('#asunto')
    const inputMensaje = document.querySelector('#mensaje')
    const inputPassword = document.querySelector('#password')
    const btnSubmit = document.querySelector('form button[type="submit"]')
    const btnCambiarFormulario = document.querySelector('form button[type="button"]')
    const btnReset = document.querySelector('form button[type="reset"]')
    const spinner = document.querySelector('#spinner')

    const formularioInicioSesion = document.querySelector('#formularioInicioSesion')
    const formularioRegistro = document.querySelector("#formularioRegistro")
    const formularioEnviarEmail = document.querySelector("#formularioEnviarEmail")

    // Controlar los listensers segun el formulario que este "usando" el usuario
    if (formularioInicioSesion) {
        inputEmail.addEventListener("blur", validarInicioSesion)
        inputPassword.addEventListener("blur", validarInicioSesion)

        formularioInicioSesion.addEventListener('submit', (evento) => {
            evento.preventDefault()
            limpiarAlerta(formularioInicioSesion)
            obtenerUsuario(usuarioIncioSesion)
        })

        btnCambiarFormulario.addEventListener('click', () => {
            window.location.href = "./registro.html";
        })
    }

    if (formularioRegistro) {
        inputNombre.addEventListener("blur", validarRegistro)
        inputEmail.addEventListener("blur", validarRegistro)
        inputPassword.addEventListener("blur", validarRegistro)

        formularioRegistro.addEventListener("submit", (evento) => {
            evento.preventDefault();
            limpiarAlerta(formularioRegistro)
            agregarUsuario(db, usuarioNuevo)
            guardarUsuarioActivo(usuarioNuevo)
            iniciarSesion();

        })

        btnCambiarFormulario.addEventListener("click", () => {
            window.location.href = "./index.html"
        })
    }

    if (formularioEnviarEmail) {
        inputEmailDestino.addEventListener('blur', validarFormularioEmail)
        inputAsunto.addEventListener('blur', validarFormularioEmail)
        inputMensaje.addEventListener('blur', validarFormularioEmail)

        formularioEnviarEmail.addEventListener('submit', enviarEmail)

        btnReset.addEventListener('click', function (evento) {
            evento.preventDefault()
            resetFormularioEmail()
        })
    }

    // Elementos de las hojas la bandeja de emails
    const saludo = document.querySelector("#saludo")
    const listadoRecibidos = document.querySelector("#listado-recibidos");
    const listadoEnviados = document.querySelector("#listado-enviados");

    // Elementos para mostrar el contenido del un email
    const mostrarOrigen = document.querySelector("#mostrarOrigen");
    const mostrarPara = document.querySelector("#mostrarDestino");
    const mostrarAsunto = document.querySelector("#mostrarAsunto");
    const mostrarMensaje = document.querySelector("#mostrarMensaje");

    const btnCerrarSesion = document.querySelector("#cerrarSesion")
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.removeItem("usuarioActivo")
            window.location.href = "../index.html"
        })
    }


    // Base de datos
    const peticion = indexedDB.open("Datos", 2);
    let db;

    peticion.onerror = (evento) => {
        mostrarAlerta(`Ha ocurrido un error al intentar cargar la base de datos, ${evento.target.errorCode}`, body)
    }

    // Una vez a terminado de abrirse la base de datos
    peticion.onsuccess = (evento) => {
        db = evento.target.result;
        console.debug("Base de datos abierta");

        if (listadoRecibidos || listadoEnviados) {
            obtenerUsuarioActivo();
            saludarUsuario();
        }

        if (listadoRecibidos) {
            console.log("recibidos");
            cargarRecibidos(usuarioActivo.email)
        }

        if (listadoEnviados) {
            console.log("enviados")
            cargarEnviados(usuarioActivo.email);
        }

        if (formularioEnviarEmail) {
            obtenerUsuarioActivo();
            emailFormulario.emailOrigen = usuarioActivo.email
        }

        if (mostrarOrigen && mostrarAsunto && mostrarMensaje) {
            obtenerUsuarioActivo();
            saludarUsuario();
            obtenerEmailLeer()
            if (emailLeer.emailOrigen !== usuarioActivo.email) {
                console.debug("leido")
                actualizarEmail(db, emailLeer)
            }
            mostrarContenidoEmail(emailLeer)
        }

        console.log(usuarioActivo)
    }

    peticion.onupgradeneeded = (evento) => {
        db = evento.target.result;

        // En caso de que no exista el almacen de objetos de los usuarios
        if (!db.objectStoreNames.contains('usuarios')) {
            const almacenObjetos = db.createObjectStore('usuarios', {keyPath: 'id', autoIncrement: true});
            almacenObjetos.createIndex("email", "email", { unique: true });
            cargarUsuarios(db)
        }

        // En caso de que no exista el almacen de objetos de los emails
        if (!db.objectStoreNames.contains('emails')) {
            const almacenObjetos = db.createObjectStore('emails', {keyPath: 'id', autoIncrement: true});
            almacenObjetos.createIndex("emailOrigen", "emailOrigen", { unique: false });
            almacenObjetos.createIndex("emailDestino", "emailDestino", { unique: false });
        }
    }


    // Funciones

    // IndexedDB

    /**
     * Carga unos usuarios por defecto que estan en un JSON
     */
    function cargarUsuarios(db) {
        const url = "data/usuarios.json";
        fetch(url)
            .then(response => response.json())
            .then(data => {almacenarUsuarios(db, data.usuarios)})
            .catch(error => mostrarAlerta("Ha ocurrido un error al cargar los usuarios", body));
    }

    /**
     * Almacena los usuarios del JSON en la BD
     */
    function almacenarUsuarios(db, usuarios) {
        usuarios.forEach(usuario => {
            console.log(usuario)
            agregarUsuario(db, usuario)
        })
    }

    /**
     * Inserta un usuario en la base de datos
     */
    function agregarUsuario(db, usuario) {
        const transaccion = db.transaction(['usuarios'], 'readwrite');
        const almacenObjetos = transaccion.objectStore('usuarios');
        const peticion = almacenObjetos.put(usuario);

        peticion.onsuccess = function() {
            console.debug('Usuario agregado:', usuario);
        }

        peticion.onerror = function() {
            mostrarAlerta(`Ha ocurrido un error al registrar al usuario ${usuario.nombre}`, body)
        }
    }

    /**
     * Busca un usuario en la base de datos para iniciar sesión
     */
    function obtenerUsuario(usuario) {
        const almacenObjetos = db.transaction('usuarios').objectStore('usuarios');
        const index = almacenObjetos.index('email');
        console.log(usuario.email);
        const peticion = index.get(usuario.email);

        peticion.onsuccess = function(evento) {
            console.log(evento.target)
            if (evento.target.result) {
                if (usuario.password === evento.target.result.password) {
                    guardarUsuarioActivo(evento.target.result)
                    iniciarSesion()
                    return;
                }
            }
            mostrarAlerta("No existe un usuario con estas credenciales", formularioInicioSesion)
        };

        peticion.onerror = function() {
            mostrarAlerta(`Ha ocurrido un error al buscar al usuario ${usuario.nombre} en la base de datos`, body)
        }
    }

    /**
     * Obtiene los emails que van a un email de destino y luego los muestra
     */
    function cargarRecibidos(emailDestino) {
        const almacenObjetos = db.transaction('emails').objectStore('emails');
        const index = almacenObjetos.index("emailDestino");
        const peticion = index.getAll(emailDestino)

        peticion.onsuccess = (evento) => {
            recibidos = evento.target.result;
            console.debug("recibidos")
            mostrarRecibidos(recibidos);
        }
        
        peticion.onerror = () => {
            mostrarAlerta("Ha ocurrido un error al buscar los emails recibidos", body)
        }


    }

    /**
     * Muestra los emails recibidos por el usuario activo
     */
    function mostrarRecibidos(recibidos) {
        recibidos.forEach(email => {
            const fila = document.createElement("TR")
            fila.id = email.id;

            const columnaOrigen = document.createElement("TD");
            columnaOrigen.textContent = email.emailOrigen;
            columnaOrigen.classList.add("px-6", "py-3");

            const columnaAsunto = document.createElement("TD")
            columnaAsunto.textContent = email.asunto;
            columnaAsunto.classList.add("px-6", "py-3");

            const columnaAccion = document.createElement("TD");

            const btnLeer = document.createElement("A");
            btnLeer.textContent = "Leer"
            btnLeer.href = "#";
            btnLeer.classList.add("px-6", "py-3");
            // Evento para leer el contendio de un email
            btnLeer.onclick = () => {
                guardarEmailLeer(email)
                window.location.href = "../leer_email.html";
            }

            columnaAccion.appendChild(btnLeer);

            // Si el destinatario no ha leido todavía el email, se marca en rosa
            if (!email.leido) {
                fila.classList.add('bg-pink-100');
                columnaAccion.classList.add("font-bold");
                columnaOrigen.classList.add('font-bold');
                columnaAsunto.classList.add('font-bold');
            }

            fila.appendChild(columnaOrigen)
            fila.appendChild(columnaAsunto)
            fila.appendChild(columnaAccion)
            listadoRecibidos.appendChild(fila)
        })
    }

    /**
     * Obtiene los emails que han sido enviados por un email y luego los muestra
     */
    function cargarEnviados(emailOrigen) {
        const almacenObjetos = db.transaction('emails').objectStore('emails');
        const index = almacenObjetos.index("emailOrigen");
        const peticion = index.getAll(emailOrigen)

        peticion.onsuccess = (evento) => {
            enviados = evento.target.result;
            console.log("enviados")
            console.log(enviados)
            mostrarEnviados(enviados);
        }

        peticion.onerror = () => {
            mostrarAlerta("Ha ocurrido un error la buscar los emails enviados", body)
        }
    }

    /**
     * Muestra los emails que ha enviado el usuario activo
     */
    function mostrarEnviados(recibidos) {
        recibidos.forEach(email => {
            const fila = document.createElement("TR")
            fila.id = email.id;

            const columnaOrigen = document.createElement("TD");
            columnaOrigen.textContent = email.emailDestino;
            columnaOrigen.classList.add("px-6", "py-3");

            const columnaAsunto = document.createElement("TD")
            columnaAsunto.textContent = email.asunto;
            columnaAsunto.classList.add("px-6", "py-3");

            const columnaAccion = document.createElement("TD");

            const btnLeer = document.createElement("A");
            btnLeer.textContent = "Leer"
            btnLeer.href = "#";
            btnLeer.classList.add("px-6", "py-3");

            // Evento para leer el contenido de un email
            btnLeer.onclick = () => {
                guardarEmailLeer(email)
                window.location.href = "../leer_email.html";
            }

            const btnBorrar  = document.createElement("A");
            btnBorrar.textContent = "Borrar";
            btnBorrar.href = "#"
            btnBorrar.classList.add("px-6", "py-3");

            // Evento para borrar un email, solo puede hacerlo quien lo envió
            btnBorrar.onclick = () => {
                eliminarEmail(db, email.id)
                limpiarHTML(listadoEnviados)
                cargarEnviados(usuarioActivo.email);
            }
            columnaAccion.appendChild(btnLeer);
            columnaAccion.appendChild(btnBorrar)

            fila.appendChild(columnaOrigen)
            fila.appendChild(columnaAsunto)
            fila.appendChild(columnaAccion)
            listadoEnviados.appendChild(fila)
        })
    }

    /**
     * Elimina un email de la base de datos
     */
    function eliminarEmail(db, idEmail) {
        const transaccion = db.transaction(['emails'], 'readwrite');
        const almacenObjetos = transaccion.objectStore('emails');
        const peticion = almacenObjetos.delete(idEmail);

        peticion.onsuccess = function() {
            console.debug(`Email con id ${idEmail} eliminado`);
        }

        peticion.onerror = function() {
            mostrarAlerta("Ha ocurrido un error al intentar eliminar el email, vuelve a intentarlo más tarde", body)
        }
    }

    /**
     * Agerga a la base de datos un email nuevo
     */
    function registrarEmail(db, email) {
        const transaccion = db.transaction(['emails'], 'readwrite');
        const almacenObjetos = transaccion.objectStore('emails');
        const peticion = almacenObjetos.add(email);
    
        peticion.onsuccess = function() {
          console.debug('Email registrado:', email);
        }
    
        peticion.onerror = function() {
          mostrarAlerta(`Ha ocurrido un error al intentar enviar el email ${peticion.error}`, body)
        }
    }

    /**
     * Actualiza los datos de un email, para registrar que ha sido leido por su destinatario
     */
    function actualizarEmail(db, emailActualizado) {
        const transaccion = db.transaction(['emails'], 'readwrite');
        const almacenObjetos = transaccion.objectStore('emails');
        const peticion = almacenObjetos.put(emailActualizado);

        peticion.onsuccess = function() {
            console.debug('Email actualizado:', emailActualizado);
        }

        peticion.onerror = function() {
            mostrarAlerta("Ha ocurrido un error al actualizar la base de datos", body)
        }
    }

    // Formularios

    /**
     * Valida los inputs del formulario de inicio de sesion
     */
    function validarInicioSesion(evento) {
        if (evento.target.value.trim() === '') {
            mostrarAlerta(`El Campo ${evento.target.id} es obligatorio`, evento.target.parentElement)
            usuarioIncioSesion[evento.target.name] = ''
            comprobarDatos(usuarioIncioSesion)
            return
        }

        if (evento.target.id === 'email' && !validarEmail(evento.target.value)) {
            mostrarAlerta('El email no es válido', evento.target.parentElement)
            usuarioIncioSesion[evento.target.name] = ''
            comprobarDatos(usuarioIncioSesion)
            return
        }

        limpiarAlerta(evento.target.parentElement)

        // Asignar los valores
        usuarioIncioSesion[evento.target.name] = evento.target.value.trim();

        comprobarDatos(usuarioIncioSesion)
    }

    /**
     * Valida los inputs del formulario de registro para nuevos usuarios
     */
    function validarRegistro(evento) {
        if (evento.target.value.trim() === '') {
            mostrarAlerta(`El Campo ${evento.target.id} es obligatorio`, evento.target.parentElement)
            usuarioNuevo[evento.target.name] = ''
            comprobarDatos(usuarioNuevo)
            return
        }

        if (evento.target.id === 'email' && !validarEmail(evento.target.value)) {
            mostrarAlerta('El email no es válido', evento.target.parentElement)
            usuarioNuevo[evento.target.name] = ''
            comprobarDatos(usuarioNuevo)
            return
        }

        limpiarAlerta(evento.target.parentElement)

        // Asignar los valores
        usuarioNuevo[evento.target.name] = evento.target.value.trim();

        comprobarDatos(usuarioNuevo)
    }

    /**
     * Valida los inputs del formulario de envio de emails
     */
    function validarFormularioEmail(evento) {
        if (evento.target.value.trim() === '') {
            mostrarAlerta(`El Campo ${evento.target.id} es obligatorio`, evento.target.parentElement)
            emailFormulario[evento.target.name] = ''
            comprobarDatos(emailFormulario)
            return
        }

        if (evento.target.id === 'emailDestino' && !validarEmail(evento.target.value)) {
            mostrarAlerta('El email no es válido', evento.target.parentElement)
            emailFormulario[evento.target.name] = ''
            comprobarDatos(emailFormulario)
            return
        }

        limpiarAlerta(evento.target.parentElement)

        // Asignar los valores
        emailFormulario[evento.target.name] = evento.target.value.trim();

        comprobarDatos(emailFormulario)
    }

    /**
     * Muestra una alerta de error
     */
    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia)

        // Generar alerta en HTML
        const error = document.createElement('P')
        error.textContent = mensaje
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center')

        // Inyectar el error al formulario
        referencia.appendChild(error)
    }

    /**
     * Elimina las alertas de un elemento
     */
    function limpiarAlerta(referencia) {
        // Comprueba si ya existe una alerta
        const alerta = referencia.querySelector('.bg-red-600')
        if (alerta) {
            alerta.remove()
        }
    }

    /**
     * Valida que el email tenga un formato válido
     */
    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        return regex.test(email)
    }

    /**
     * Comprueba que todos los inputs de un formulario no esten vacíos
     */
    function comprobarDatos(objetoDatos) {
        if (Object.values(objetoDatos).includes('')) {
            btnSubmit.classList.add('opacity-50')
            btnSubmit.disabled = true
            return
        }
        btnSubmit.classList.remove('opacity-50')
        btnSubmit.disabled = false
    }

    /**
     * Inicia sesion, cambia a la pagina de la bandeja de emails
     */
    function iniciarSesion() {
        mostrarSpinner()
        window.location.href = "../bandeja_recibidos.html";
    }

    /**
     * Envía un email
     */
    function enviarEmail(evento) {
        evento.preventDefault()
    
        spinner.classList.remove('hidden')
    
        btnSubmit.classList.add("opacity-50")
        btnSubmit.disabled = true
    
        setTimeout(() => {
          spinner.classList.add('hidden')
    
          // Crear una alerta
          const alertaExito = document.createElement('P')
          alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase')
          alertaExito.textContent = 'Mensaje enviado correctamente'
          registrarEmail(db, emailFormulario)
    
          formularioEnviarEmail.appendChild(alertaExito)
    
          setTimeout(() => {
            alertaExito.remove()
          }, 3000)
    
          resetFormularioEmail()
        }, 3000)
    }
      
    /**
     * Resetea los inputs del formulario
     */
    function resetFormularioEmail() {
        // reiniciar el objeto
        emailFormulario.emailDestino = ''
        emailFormulario.asunto = ''
        emailFormulario.mensaje = ''
    
        formularioEnviarEmail.reset()
        comprobarDatos(emailFormulario)
    }


    // LocalStorage

    /**
     * Almacena en localStorage los datos del usuario que ha iniciado sesion
     */
    function guardarUsuarioActivo(usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    }

    /**
     * Obtiene los datos del usuario que esta activo
     */
    function obtenerUsuarioActivo() {
        const usuarioJSON = localStorage.getItem("usuarioActivo");   
        const usuarioAlmacenado = JSON.parse(usuarioJSON);

        usuarioActivo.id = usuarioAlmacenado.id;
        usuarioActivo.nombre = usuarioAlmacenado.nombre;
        usuarioActivo.email = usuarioAlmacenado.email;
        usuarioActivo.password = usuarioAlmacenado.password;

        console.debug(usuarioActivo)
    }

    /**
     * Guarda los datos del email que va a leer el usuario activo
     */
    function guardarEmailLeer(email) {
        localStorage.setItem("emailLeer", JSON.stringify(email))
    }

    function obtenerEmailLeer() {
        const emaiLeerJSON = localStorage.getItem("emailLeer");
        const emailLeerAlmacenado = JSON.parse(emaiLeerJSON);

        emailLeer.id = emailLeerAlmacenado.id;
        emailLeer.emailOrigen = emailLeerAlmacenado.emailOrigen;
        emailLeer.emailDestino = emailLeerAlmacenado.emailDestino;
        emailLeer.asunto = emailLeerAlmacenado.asunto;
        emailLeer.mensaje = emailLeerAlmacenado.mensaje;
    }



    // Otras

    /**
     * Limpia los elementos hijos de un elemento padre
     */
    function limpiarHTML(elementoPadre) {
        while (elementoPadre.firstChild) {
            elementoPadre.removeChild(elementoPadre.firstChild)
        }
    }

    /**
     * Saludo al usuario por su nombre
     */
    function saludarUsuario() {
        saludo.textContent = `¡Hola, ${usuarioActivo.nombre}! 👋`
    }

    /**
     * Muestra un spinner de carga
     */
    function mostrarSpinner() {
        spinner.classList.remove('hidden')

        btnSubmit.classList.add("opacity-50")
        btnSubmit.disabled = true

        setTimeout(() => {
            spinner.classList.add('hidden')
        }, 3000)
    }

    /**
     * Muestra el contenido y los datos de un email
     */
    function mostrarContenidoEmail(email) {
        const filaOrigen = document.createElement("TR")
        const columnaOrigen = document.createElement("TD")
        columnaOrigen.textContent = email.emailOrigen;
        columnaOrigen.classList.add("px-6", "py-3");

        const filaDestino = document.createElement("TR")
        const columnaDestino = document.createElement("TD")
        columnaDestino.textContent = email.emailDestino;
        columnaDestino.classList.add("px-6", "py-3");

        const filaAsunto = document.createElement("TR")
        const columnaAsunto = document.createElement("TD")
        columnaAsunto.textContent = email.asunto;
        columnaAsunto.classList.add("px-6", "py-3");

        const filaMensaje = document.createElement("TR")
        const columnaMensaje = document.createElement("TD")
        columnaMensaje.textContent = email.mensaje;
        columnaMensaje.classList.add("px-6", "py-3");

        filaOrigen.appendChild(columnaOrigen)
        filaDestino.appendChild(columnaDestino)
        filaAsunto.appendChild(columnaAsunto)
        filaMensaje.appendChild(columnaMensaje)

        mostrarOrigen.appendChild(filaOrigen)
        mostrarPara.appendChild(filaDestino)
        mostrarAsunto.appendChild(filaAsunto)
        mostrarMensaje.appendChild(filaMensaje)
    }
})
