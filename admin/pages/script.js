import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";
import { mostrarModal } from "../modules/mostrarModal.js";
import { initializeSearch } from "../modules/searchFunction.js";
import { changeSemanaSelect } from "../modules/tabla/changeSelectEvent.js";
import { addEditEventListeners } from "../modules/tabla/editRow.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import { updateAttendanceCounter } from "../modules/tabla/attendanceCounter.js";
import "../modules/downloadToExcel.js";
import "../modules/newRegister.js";
import { applyWinnerHighlight } from "../modules/highlightWinner.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

export function mostrarDatos() {
    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        let filaNumero = 1;

        data.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = ` 
                <td class="text-center">${filaNumero++}</td>

                <!-- Columna con select para nombre y opción de 'Ganador' -->
                <td class="text-center">
                    <div class="flex-container">
                        <span>${user.nombre}</span>
                        <select class="form-select winner-select" data-id="${user.id}" data-field="ganador">
                            <option value="" ${user.ganador === "" ? "selected" : ""}></option>
                            <option value="Ganador" ${user.ganador === "Ganador" ? "selected" : ""}>Ganador</option>
                        </select>
                    </div>
                </td>

                <!-- Aquí se mostrará el contador -->
                <td class="text-center attendance-cell"></td>

                ${["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].map((dia) => ` 
                    <td class="text-center">
                        <div class="flex-container">
                            <span class="${!user[dia] ? 'invisible-value' : ''}">${user[dia] || ''}</span>
                            <select class="form-select pay-select" data-id="${user.id}" data-field="${dia}">
                                <option value="" ${user[dia] === "" ? "selected" : ""}></option>
                                <option value="---" ${user[dia] === "---" ? "selected" : ""}></option>
                                <option value="12.00" ${user[dia] === "12.00" ? "selected" : ""}>12.00</option>
                            </select>
                        </div>
                    </td>
                `).join('')}

                <td class="display-flex-center">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(row);

            // Actualizar contador de asistencia para cada fila
            updateAttendanceCounter(row);
            // Aplicar el estilo de 'Ganador' si está seleccionado
            applyWinnerHighlight(row);
        });

        // Eventos para selects de ganador
        const winnerSelectElements = document.querySelectorAll(".winner-select");
        winnerSelectElements.forEach((selectElement) => {
            selectElement.addEventListener("change", function () {
                const selectedValue = this.value;
                const userId = this.getAttribute("data-id");

                update(ref(database, `${collection}/${userId}`), {
                    ganador: selectedValue,
                });
            });
        });

        // Manejo de los selects de asistencia
        const selectElements = document.querySelectorAll("select.pay-select");

        selectElements.forEach((selectElement) => {
            selectElement.addEventListener("change", function () {
                const selectedValue = this.value;
                const userId = this.getAttribute("data-id");
                const field = this.getAttribute("data-field");

                if (["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].includes(field)) {
                    if (!confirm("¿Estás seguro de que deseas hacer este cambio?")) {
                        this.value = this.dataset.oldValue;
                        return;
                    }
                }

                update(ref(database, `${collection}/${userId}`), {
                    [field]: selectedValue,
                });
            });

            const selectedValue = selectElement.value;
            selectElement.dataset.oldValue = selectedValue;
            selectElement.disabled = selectedValue === "12.00";
            if (selectedValue === "12.00" || selectedValue === "Completado") {
                selectElement.closest('div.flex-container').querySelector('span').style.color = "green";
                selectElement.closest('div.flex-container').querySelector('span').style.fontWeight = "bold";
            }
        });

        deleteRow(database, collection);
        addEditEventListeners(database, collection);
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#showModalButton').addEventListener('click', mostrarModal);
    mostrarDatos();
    initializeSearch(tabla);
    changeSemanaSelect(tabla, database, collection);
});

console.log(database);
