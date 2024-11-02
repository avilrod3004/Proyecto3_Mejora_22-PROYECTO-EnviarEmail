
// Incluimos un spinner - spinkit
// https://tobiasahlin.com/spinkit/

// Vamos a la web y cogemos uno cualquiera.
// Copiamos el HTML y lo pegamos en la web.
// Creamos una hoja CSS nueva, spinner.css y ponemos en ella el CSS del componente.
// Enlazamos la hoja de estilos del spinner.
// Vemos que está en blanco, abajo, casi no se ve, vamos a cambiar el color en el CSS.
// Metemos el spinner en un div y lo posicionamos al centro.
// Le ponemos al spinner una clase hidden y lo ocultamos, luego se la quitaremos cuando nos interese.

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
  btnReset.addEventListener("click", (e)=> {
    e.preventDefault() 
    emailObj.email = ""
    emailObj.asunto = ""
    emailObj.mensaje = ""

    formulario.reset() 

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

  // Vamos a mostrar el spinner...
})


