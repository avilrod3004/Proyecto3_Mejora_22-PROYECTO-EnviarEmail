// Ocultamos las alertas si se pasa la validación.

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
    // Eliminamos el else, no nos sirve para nada.
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
      return // Con este return cortamos la ejecución y solo ejecuta limpiar alerta cuando ha pasa la validación.
    } 
    // else {
    //   console.log("Ha pasado la validación")
    // }
    // Con el return evitamos poner el else.

    // Si pasa la validación llamamos a una función que limpie la alerta.
    // limpiarAlerta()
    // Le pasamos a la función la referencia a limpiar, e.target.parentElement, ya usamos esa refrencia para crear la alerta, sabemos que es el contenedor que la muestra.
    limpiarAlerta(e.target.parentElement)
  }

  // Función para limpiar la alerta
  // function limpiarAlerta() {
  // La función recibe la referencia a limpiar como parámetro
  function limpiarAlerta(referencia) {
    // console.log("Limpiando alerta...")
    // Mismo código que tenemos en mostrar alerta...
    const alerta = referencia.querySelector(".bg-red-600")
    if (alerta) {
      alerta.remove()
    } 
  }

  // Función para mostrar el mensaje de error en el código.
  function mostraAlerta(mensaje, referencia) {
    // Eliminamos este código y llamaamos a la función - DRY
    // const alerta = referencia.querySelector(".bg-red-600")
    // if (alerta) {
    //   alerta.remove()
    // } 
    limpiarAlerta(referencia)
    
    const error = document.createElement("P")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    referencia.appendChild(error)
  }

  // Vamos, a continuación, a validar el email.
})