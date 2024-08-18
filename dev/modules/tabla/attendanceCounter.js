import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../environment/firebaseConfig.js"; // Ensure this import is correct

export function updateAttendanceCounter(row) {
    const days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    let counter = 0;
    const userId = row.querySelector("select[data-field='lunes']").getAttribute("data-id");

    // Calculate attendance count
    days.forEach(day => {
        const selectElement = row.querySelector(`select[data-field="${day}"]`);
        if (selectElement && selectElement.value === "12.00") {
            counter++;
        }
    });

    const attendanceCell = row.querySelector('.attendance-cell');
    let attendanceText = '';

    if (attendanceCell) {
        if (counter === 6) {
            attendanceText = "Completo";
            attendanceCell.style.color = 'green';
            attendanceCell.style.fontWeight = 'bold';
        } else if (counter === 0) {
            attendanceText = "0/6";
            attendanceCell.style.color = 'red';
            attendanceCell.style.fontWeight = 'bold';
        } else {
            attendanceText = `${counter}/6`;
            attendanceCell.style.color = 'orange';
            attendanceCell.style.fontWeight = 'bold';
        }
        attendanceCell.textContent = attendanceText;

        // Update attendance in Firebase
        update(ref(database, `${collection}/${userId}`), {
            attendanceCount: attendanceText
        });
    }
}
