import { push, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

// Función para mostrar el modal y manejar el registro de datos
export function showAndRegisterModal() {
  const formElement = document.getElementById("registerForm");
  const modalElement = document.getElementById("registerModal");

  // Restablecer el formulario si existe
  if (formElement) {
    formElement.reset();
  } else {
    console.error("El formulario no fue encontrado.");
  }

  // Mostrar el modal si existe
  if (modalElement) {
    let myModal = bootstrap.Modal.getInstance(modalElement);
    if (!myModal) {
      myModal = new bootstrap.Modal(modalElement);
    }
    myModal.show();
  } else {
    console.error("El modal no fue encontrado.");
  }

  // Lógica para manejar el envío del formulario
  if (formElement) {
    let isSubmitting = false;

    formElement.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita que se recargue la página al enviar el formulario

      if (!isSubmitting) {
        isSubmitting = true; // Bloquea el formulario para evitar múltiples envíos

        const nombreInput = document.getElementById("validationNombre").value;

        // Verifica que el campo no esté vacío
        if (nombreInput.trim() !== "") {
          const nuevoRegistro = { nombre: nombreInput };
          const referenciaUnidades = ref(database, collection); // Reemplaza 'collection' con el path adecuado

          // Agregar datos a Firebase
          push(referenciaUnidades, nuevoRegistro)
            .then(() => {
              formElement.reset(); // Limpia el formulario
              setTimeout(() => {
                isSubmitting = false; // Desbloquea el formulario después de 1 segundo
              }, 1000);
              setTimeout(() => {
                location.reload(); // Recarga la página
              }, 100);
            })
            .catch((error) => {
              console.error("Error al enviar datos a la base de datos:", error);
              isSubmitting = false;
            });
        } else {
          alert("Por favor completa todos los campos.");
          isSubmitting = false; // Desbloquea el formulario si la validación falla
        }
      } else {
        alert("Ya se está enviando un formulario. Por favor espera unos momentos.");
      }
    });
  } else {
    console.error("El formulario no fue encontrado.");
  }
}
