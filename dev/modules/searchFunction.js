// searchFunction.js
import { database } from "../environment/firebaseConfig.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

export function findAndSearch(tabla) {
  const input = document.getElementById("searchInput").value.toLowerCase();
  // const collection = "libreria-de-conductores"; // La colección en Firebase

  // Obtén los datos desde Firebase
  onValue(ref(database, collection), (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      data.push(user);
    });

    // Filtrar los datos
    const filteredData = data.filter(user => {
      return Object.values(user).some(value => value.toString().toLowerCase().includes(input));
    });

    // Renderiza los datos filtrados
    renderUsersTable(filteredData);
  });
}

// Función para renderizar los datos en la tabla
function renderUsersTable(data) {
  const tabla = document.getElementById("miTabla");
  tabla.innerHTML = "";

  data.forEach((user, index) => {
    const row = `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td class="text-center">${user.nombre}</td>
        <td class="text-center">${user.semana}</td>
        <td class="text-center">${user.lunes}</td>
        <td class="text-center">${user.martes}</td>
        <td class="text-center">${user.miercoles}</td>
        <td class="text-center">${user.jueves}</td>
        <td class="text-center">${user.viernes}</td>
        <td class="text-center">${user.sabado}</td>
        <td class="text-center">${user.estado}</td>
        <td class="text-center">${user.role}</td>
        <td>
          <button class="btn btn-danger delete-user-button" data-id="${user.id}"><i class="bi bi-eraser-fill"></i></button>
        </td>
        <td class="text-center">${user.email}</td>
        <td class="text-center">${user.userId}</td>
      </tr>
    `;
    tabla.innerHTML += row;
  });
}

export function initializeSearch(tabla) {
  document.getElementById("searchButton").addEventListener("click", () => findAndSearch(tabla));

  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      findAndSearch(tabla);
    }
  });
}
