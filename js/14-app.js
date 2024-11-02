
// Incluimos un spinner - spinkit 

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
  const btnReset = document.querySelector('#formulario button[type="reset"]')
  // Le ponemos un id en el código HTML... y luego hacemos el selector
  const spinner = document.querySelector("#spinner")

  // Listeners
  inputEmail.addEventListener("blur", validar)
  inputAsunto.addEventListener("blur", validar)
  inputMensaje.addEventListener("blur", validar)
  // Añadimos un listener al submit del funcionario.
  formulario.addEventListener("submit", enviarEmail)
  btnReset.addEventListener("click", (e)=> {
    e.preventDefault() 
    emailObj.email = ""
    emailObj.asunto = ""
    emailObj.mensaje = ""
    formulario.reset() 
    comprobarEmail()
  })

  // Funciones

  // Función que activa el listener
  function enviarEmail(e) {
    e.preventDefault()
    // console.log("Enviando...")

    // Le quitamos la clase de hidden.
    spinner.classList.remove("hidden")
    // Ya funciona el spinner, ahora tenemos que controlarlo, tiene que ocultarse y salir el mensaje de exito.
  }

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

  // Ya funciona el spinner, ahora tenemos que controlarlo, tiene que ocultarse y salir el mensaje de exito.
})


