// highlightWinner.js

export function applyWinnerHighlight(row) {
    const winnerSelect = row.querySelector(".winner-select");
    const nameElement = row.querySelector(".flex-container > span");
    const tableBody = row.parentElement; // Obtener el elemento tbody donde están las filas

    // Escuchar el cambio de selección para la opción 'Ganador'
    winnerSelect.addEventListener("change", () => {
        if (winnerSelect.value === "Ganador") {
            // Aplicar estilos de ganador
            nameElement.style.color = "red";
            nameElement.style.fontWeight = "bold";

            // Mover la fila al principio de la tabla
            tableBody.insertBefore(row, tableBody.firstChild);
        } else {
            // Revertir al estilo original si no es 'Ganador'
            nameElement.style.color = "";
            nameElement.style.fontWeight = "";
        }
    });

    // Aplicar estilo de ganador si ya está seleccionado al cargar
    if (winnerSelect.value === "Ganador") {
        nameElement.style.color = "#007FFF";
        nameElement.style.fontWeight = "500";
        nameElement.style.fontSize = "1.2em"; 

        // Mover la fila al principio si ya está seleccionada como 'Ganador'
        tableBody.insertBefore(row, tableBody.firstChild);
    }
}
