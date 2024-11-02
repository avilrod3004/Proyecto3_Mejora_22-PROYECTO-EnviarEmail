
// Controlamos que cuando esté el botón activado el usuario no borre un campo del formulario.

// (*1*)Si un campo se borra, tenemos que volver a lanzar la comprobación. Estamos comprobando el email una vez que pasa las validaciones, pero en este caso, debemos comprobarlo tambien antes de que se lancen las alertas.

document.addEventListener("DOMContentLoaded", () => {
  const emailObj = {
    email: "",
    asunto: "",
    mensaje:""
  }

  // Selectores
  const inputEmail = document.querySelector("#email")
  const inputAsunto = document.querySelector("#asunto")
  const inputMensaje = document.querySelector("#mensaje")
  const formulario = document.querySelector("#formulario")
  const btnSubmit = document.querySelector('#formulario button[type="submit"]')

  // Listeners
  inputEmail.addEventListener("blur", validar)
  // inputEmail.addEventListener("input", validar)

  inputAsunto.addEventListener("blur", validar)
  // inputAsunto.addEventListener("input", validar)

  inputMensaje.addEventListener("blur", validar)
  // inputAsunto.addEventListener("input", validar)


  // Funciones

  // Función validar que desencadenan los inputs.
  function validar(e) {
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)

      // (*4*) Limpiamos la propiedad.
      emailObj[e.target.name] = ""
      
      // (*2*) Añadimos la llamada a la función comprobarEmail()
      comprobarEmail()
      return 
    } 
    if (e.target.id === "email" && !validarEmail(e.target.value)) {
      mostraAlerta("El email no es válido", e.target.parentElement)

      // (*4*) Limpiamos la propiedad
      emailObj[e.target.name] = ""

      // (*4...*) Una vez que hemos limpiado la propiedad, ya podemos cambiar la opacidad y la visibilidad del botón. (*...5*)

      // (*2*) Añadimos la llamada a la función comprobarEmail()
      comprobarEmail()
      return
    }

    limpiarAlerta(e.target.parentElement)

    emailObj[e.target.name] = e.target.value.trim().toLowerCase()
    comprobarEmail()
  }

  // Funcióm comprobar email
  function comprobarEmail() {
    // (*3*) Tenemos que activar el opacity y poner el disable en true. Pero, miremos el objeto en la consola:
    console.log(emailObj)
    // Podemos observar que aunque borre un campo, el objeto sigue manteniendo los datos completos, tenemos que "limpiarlo". Tenemos que reiniciar la propiedad, cuando la validación falla. (*...4*)
    const values = Object.values(emailObj)
    if (values.includes("")) {
      // (*5*) Cambiamos la opacidad y el disabled
      btnSubmit.classList.add("opacity-50")
      btnSubmit.disabled = true
    } else {
      btnSubmit.classList.remove("opacity-50")
      btnSubmit.disabled = false
    }

    // Quitamos el else, añadiendo un return
    // if (values.includes("")) {
    //   // (*5*) Cambiamos la opacidad y el disabled
    //   btnSubmit.classList.add("opacity-50")
    //   btnSubmit.disabled = true
    //   return
    // } 
    // btnSubmit.classList.remove("opacity-50")
    // btnSubmit.disabled = false
  }

  // Función para validar el email.
  function validarEmail(email)  {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    const resultado = regex.test(email)
    return resultado
  }

  // Función para limpiar la alerta.
  function limpiarAlerta(referencia) {
    const alerta = referencia.querySelector(".bg-red-600")
    if (alerta) {
      alerta.remove()
    } 
  }

  // Función para mostrar el mensaje de error en el código.
  function mostraAlerta(mensaje, referencia) {
    limpiarAlerta(referencia)

    const error = document.createElement("P")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    referencia.appendChild(error)
  }

  // Vemos que ahora mismo funciona el botón de reset, pero vemos que el boton de enviar no se deshabilita, y debería.
})


// Podemos probar a cambiar el evento, si ponemos input en vez de blur, veremos que es mas en "tiempo real".