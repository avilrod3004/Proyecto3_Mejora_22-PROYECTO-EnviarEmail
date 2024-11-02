
// Declaramos una función validar

document.addEventListener("DOMContentLoaded", () => {

  // Selectores
  const inputEmail = document.querySelector("#email")
  const inputAsunto = document.querySelector("#asunto")
  const inputMensaje = document.querySelector("#mensaje")
  const formulario = document.querySelector("#formulario")

  // Listeners
  inputEmail.addEventListener("blur", validar)
  inputAsunto.addEventListener("blur", validar)
  inputMensaje.addEventListener("blur", validar)

  // Funciones
  function validar(e) {
    // if (e.target.value === "") {  
    // Problema de espacios en blanco..
    // Usamos trim(), podemos probarlo en la consola del navegador.
    if (e.target.value.trim() === "") {
      console.log("Hubo un error")
    } else {
      console.log("Ha pasado la validación")
    }
  }

  // Nadie navega mirando la consola del navegador, vamos a pintar los mensajes de error en la pantalla. Vamos a desarrollar una función para ello, mostraAlerta().

})