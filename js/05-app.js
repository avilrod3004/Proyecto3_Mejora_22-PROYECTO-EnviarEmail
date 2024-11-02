  // Vamos a utilizar traversing para pintar el mensaje cerca del input al que se refiere. 

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
    // Traversing hasta el padre del elemento al que refiere el mensaje, y lo insertamos, quedará debajo del input.
    // console.log(e.target.parentElement)
    // Se lo pasamos a la función como un segundo argumento, mas reusabilidad.
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
    } else {
      console.log("Ha pasado la validación")
    }
  }

  // Función para mostrar el mensaje de error en el código.
  // Añadimos el segundo parámetro
  function mostraAlerta(mensaje, referencia) {
    const error = document.createElement("P")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    // Insertamos el elemento en el código HTML.
    referencia.appendChild(error)
  }

  // Si nos movemos por el funcionario vemos que la alerta se ve duplicando, vamos a ir solucionando eso...

})