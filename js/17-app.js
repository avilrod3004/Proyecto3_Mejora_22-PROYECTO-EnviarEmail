
// Para finalizar vamos a mostrar un mensaje de éxito.

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
    resetform()
  })
  // Si cambiamos el evento que hemos asignado a los listeners blur por input, validará a medida que el usuario escriba, sin necesidad de que se cambie de input.

  // Funciones

  // Función que activa el listener
  function enviarEmail(e) {
    e.preventDefault()
    spinner.classList.remove("hidden")

    // Si sale el spinner es que ha pasado las validaciones, es que ha pasado las 
    // validaciones, deshabilitamos el botón enviar.
    btnSubmit.classList.add("opacity-50")
    btnSubmit.disabled = true

    setTimeout(()=> {
      spinner.classList.add("hidden")

      resetform()

      // Creamos una alerta - No es el casp, pero, si lo vamos a usar en varios sitios, creamos una función.
      const alerta = document.createElement("P")
      alerta.classList.add("bg-green-500", "text-white", "p-2", "text-center", "rounded-lg", "mt-10", "font-bold", "text-sm", "uppercase")
      alerta.textContent = "Mensaje enviado correctamente"
      // Lo insertamos al final del formulario
      formulario.appendChild(alerta)

      // El mensaje se queda siempre, ponemos otrro setTimeout para quitarlo.
      setTimeout(()=> {
        alerta.remove()
      },3000)

    }, 3000)
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
    comprobarEmail()
  }
})

// **** Actividad de clase **** 
// Tiempo estimado - 20 min.
// Añade un campo CC para añadir un destino extra.
// Ese campo no es obligatorio, pero en caso de tener información, debes validar que sea un email válido.
