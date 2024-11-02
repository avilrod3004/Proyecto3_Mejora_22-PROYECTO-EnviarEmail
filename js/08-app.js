
// Validamos el email usando una expresión regular.

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
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
      return 
    } 
    // Validamos el email
    // validarEmail(e.target.value)

    // Ahora que ya hemos implementado la función validar, validamos el email y si devuelve false, lanzamos una alerta. 
    if (!validarEmail(e.target.value)) {

    // if (e.target.id === "email" && !validarEmail(e.target.value)) {
    // Cuando acabamos, vemos que esta aplicando la validación de email a todos lo campos, añadimos una condición para que eso no pase. 

      // Lo negamos para que se muestre cuando no se pasa la validación.
      mostraAlerta("El email no es válido", e.target.parentElement)
      return
    }

    limpiarAlerta(e.target.parentElement)
  }

  // Función para validar el email
  function validarEmail(email)  {
    // Si necesitas una expresión regular vas a internet y la buscas, seguramente hay quien le guste perder el tiempo aprendiendoselas..., cada cual tiene sus aficiones.
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    // console.log(regex.test(email))
    const resultado = regex.test(email)
    // Devolvemos el resultado..
    return resultado
  }

  // Función para limpiar la alerta
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

  // Ya podemos cumplimentar los tres campos bien y los valida, pero vemos que el boton de enviar sigue deshabilitado. Si miramos el código tiene el atributo disable y ademas tiene opacity.
})