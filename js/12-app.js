
// Mejoramos la funcionalidad de reset, al hacer click en reset tenemos que deshabilitar el botón de enviar.

// Ahora mismo el comportamiento que tiene es el normal de un botón type reset, vamos a modificarlo...

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
  // Seleccionamos el botón de reset
  const btnReset = document.querySelector('#formulario button[type="reset"]')

  // Listeners
  inputEmail.addEventListener("blur", validar)
  inputAsunto.addEventListener("blur", validar)
  inputMensaje.addEventListener("blur", validar)
  // Escuchamos el evento click en el botón reset.
  btnReset.addEventListener("click", (e)=> {
    e.preventDefault() // Prevenimos la acción por defecto, en este caso, resetear.

    // Nosotros podemos reiniciarlo manualmente.
    // formulario.reset() -- probamos y vemos que así podemos lanzarlo nosotros.

    // El problema es que si vemos el botón de enviar, sigue habilitado. Hemos reiniciado el formulario, pero no el objeto. Vamos a reiniciarlo y una vez que lo hagamos, llamamos a la función que comprueba el email.

    // Reiniciamos el objeto
    emailObj.email = ""
    emailObj.asunto = ""
    emailObj.mensaje = ""

    formulario.reset() 

    // Llamamos a la función que comprueba el email, esta detectará los campos vacios y deshabilitará el botón.
    comprobarEmail()

  })

  // Funciones

  // Función validar que desencadenan los inputs.
  function validar(e) {
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
      emailObj[e.target.name] = ""
      comprobarEmail()
      return 
    } 
    if (e.target.id === "email" && !validarEmail(e.target.value)) {
      mostraAlerta("El email no es válido", e.target.parentElement)
      emailObj[e.target.name] = ""
      comprobarEmail()
      return
    }
    limpiarAlerta(e.target.parentElement)
    emailObj[e.target.name] = e.target.value.trim().toLowerCase()
    comprobarEmail()
  }

  // Funcióm comprobar email
  function comprobarEmail() {
    const values = Object.values(emailObj)
    if (values.includes("")) {
      btnSubmit.classList.add("opacity-50")
      btnSubmit.disabled = true
      return
    } 
      btnSubmit.classList.remove("opacity-50")
      btnSubmit.disabled = false
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

  // Simulemos el envío del email...
})


