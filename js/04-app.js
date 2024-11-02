
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
      // Le pasamos el mensaje como argumento a la función. 
      // mostraAlerta("El campo email es obligatorio")
      // Podemos usar los ids de los campos para personalizar el mensaje de error.
      mostraAlerta(`El campo ${e.target.id} es obligatorio`)

    } else {
      console.log("Ha pasado la validación")
    }
  }

  // Función para mostrar el mensaje de error en el código.
  // La función ahora recibe el mensaje como parámetro.
  function mostraAlerta(mensaje) {
    const error = document.createElement("P")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    formulario.appendChild(error)
  }

  // Ya estamos mostrando el mensaje de error, pero se muestra siempre en la parte inferior del formulario, deberíamos mostrarlos cerca del campo al que pertenezca. 

})