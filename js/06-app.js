
// Prevenimos que se generen multiples alertas

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
    } else {
      console.log("Ha pasado la validación")
    }
  }

  // Función para mostrar el mensaje de error en el código.
  function mostraAlerta(mensaje, referencia) {
    // Comprobamos si ya existe una alerta. 
    // Para comprobarlo podemos usar una de las clases que le hemos añadido, si hay alguna que sea única, sino podemos ponerle una clase que sea alerta. Así podemos comprobar si ya existe un mensaje de alerta.

    // const alerta = document.querySelector(".bg-red-600")
    // if (alerta) {
    //   console.log("Existe")
    //   // La eliminamos..
    //   alerta.remove()
    // } 

    // Tenemos un problema, y es que si nos movemos por el formulario, vemos que el mensaje desaparece. Esto es porque al cambiarnos de campo y salir, comprueba si hay mensajes de error, como estamos buscando la clase en el documento entero, encuentra el de otro campo y lo borra. 
    
    // Tenemos que buscar el mensaje de error, solo en el div en el que estamos, es decir, en referencia.

    const alerta = referencia.querySelector(".bg-red-600")
    if (alerta) {
      alerta.remove()
    } 

    const error = document.createElement("P")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    referencia.appendChild(error)
  }

  // Que pasa si vemos el mensaje de error y ponemos un email válido, vemos que el mensaje sigue estando. Si lo que el usuario escribe pasa la validación tenemos que quitarlo.
})