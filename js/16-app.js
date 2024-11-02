
// Hemos duplicado un código que, obviamente, debería ir ahora en una función.

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
  const spinner = document.querySelector("#spinner")

  // Listeners
  inputEmail.addEventListener("blur", validar)
  inputAsunto.addEventListener("blur", validar)
  inputMensaje.addEventListener("blur", validar)
  formulario.addEventListener("submit", enviarEmail)
  btnReset.addEventListener("click", (e)=> {
    e.preventDefault() 
    // Llamamos a la función:
    resetform()
  })

  // Funciones

  // Función que activa el listener
  function enviarEmail(e) {
    e.preventDefault()
    spinner.classList.remove("hidden")

    setTimeout(()=> {
      spinner.classList.add("hidden")
    }, 3000)
    // Llamamos a la función:
    resetform()
   
    comprobarEmail()
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

  // Función para resetear el formulario
  function resetform() {
    emailObj.email = ""
    emailObj.asunto = ""
    emailObj.mensaje = ""
    formulario.reset() 
  }

  // Para finalizar vamos a mostrar un mensaje de éxito.
})


