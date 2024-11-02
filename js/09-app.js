
// Habilitamos el botón de enviar.

document.addEventListener("DOMContentLoaded", () => {

  // Vamos a declarar un objeto, de manera que cuando el usuario vaya escribiendo guardemos en el los diferentes campos, una vez pasada la validación.
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

  // Listeners
  inputEmail.addEventListener("blur", validar)
  inputAsunto.addEventListener("blur", validar)
  inputMensaje.addEventListener("blur", validar)

  // Funciones

  // Función validar que desencadenan los inputs.
  function validar(e) {
    if (e.target.value.trim() === "") {
      mostraAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
      return 
    } 
    if (e.target.id === "email" && !validarEmail(e.target.value)) {
      mostraAlerta("El email no es válido", e.target.parentElement)
      return
    }

    limpiarAlerta(e.target.parentElement)

    // Si la llegamos hasta aquí, hemos pasado la validación, asignamos los valores al objeto.
    // Podemos usar el id o el name de los inputs para hacer la asignación dinámicamete.
    // emailObj[e.target.name] = e.target.value
    // Aprovechamos para eliminar los espacios en blanco, y de camino lo ponemos todo en minúscula (odio a la gente que escribe en mayúscula)
    emailObj[e.target.name] = e.target.value.trim().toLowerCase()
    // console.log(emailObj)

    // Vamos ahora con el botón de enviar, comprobamos que el objeto email está completo, y si es así habilitaremos el botón.
    comprobarEmail()
  }

  // Funcióm comprobar email
  function comprobarEmail() {
    const values = Object.values(emailObj)
    console.log(values.includes(""))
    // Nos devuelve un true, hasta que esten todos los campos rellenos, podemos usarlo para activar / desactivar el botón.
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

  // Seguimos con el botón...
})