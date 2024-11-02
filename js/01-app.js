// Vamos a comenzar con los selectores y listeners... 

document.addEventListener("DOMContentLoaded", () => {

  // Selectores
  const inputEmail = document.querySelector("#email")
  const inputAsunto = document.querySelector("#asunto")
  const inputMensaje = document.querySelector("#mensaje")
  const formulario = document.querySelector("#formulario")

  // Listeners
  inputEmail.addEventListener("blur", (e) => {
    console.log("Hubo un error")
  })
  inputAsunto.addEventListener("blur", (e) => {
    console.log("Hubo un error")

  })
  inputMensaje.addEventListener("blur", (e) => {
    console.log("Hubo un error")
  })

  // Ese codigo, no está mal, pero podríamos cambiar los callbacks por una función externa.
})