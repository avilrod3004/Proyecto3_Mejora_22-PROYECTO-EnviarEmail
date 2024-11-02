
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
      mostraAlerta()
    } else {
      console.log("Ha pasado la validación")
    }
  }

  // Función para mostrar el mensaje de error en el código.
  function mostraAlerta() {
    // console.log("Hubo un error")
    // Generar alerta en HTML
    const error = document.createElement("P")
    // Insertamos el texto del error
    error.textContent = "Hubo un error"
    // Añadimos las clases 
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    // Y lo insertamos en el código.
    formulario.appendChild(error)
  }

  // Vamos a hacer un poco mas reutilizable la función, y a darle mas informafión al usurio del error...

})