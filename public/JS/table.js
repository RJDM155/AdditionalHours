function calculatePay(id, hoursWorked, payRate) {
    const normalHours = 48; // Horas normales (sin extra)
    const basePayPerHour = 100; // Pago por hora base
    const maxExtraHours1 = 9; // Máximo de horas extra a pagar al doble
    const extraPayRate1 = 2; // Pago al doble
    const extraPayRate2 = 3; // Pago al triple

    // Paso 1: Calcular las horas extras
    let extraHours = hoursWorked - normalHours;
    let totalPay = payRate; // Empezamos con el salario base que ya está dado

    // Paso 2: Calculamos el pago de las horas extras
    if (extraHours > 0) {
        // Las primeras 9 horas extra se pagan al doble
        if (extraHours <= maxExtraHours1) {
            totalPay += extraHours * (basePayPerHour * extraPayRate1); // Pagamos al doble
        } else {
            // Primero, las primeras 9 horas extra se pagan al doble
            totalPay += maxExtraHours1 * (basePayPerHour * extraPayRate1); 
            // Luego, las horas extra adicionales se pagan al triple
            extraHours -= maxExtraHours1;
            totalPay += extraHours * (basePayPerHour * extraPayRate2); // Pagamos al triple
        }
    }

    // Paso 3: Mostrar el resultado en el campo "to pay"
    document.getElementById(`to-pay-${id}`).innerText = totalPay.toFixed(2);
}


const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

window.addEventListener('load', () => {
    sidebar.classList.add('hidden');
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});


function openUpdateModal(id, username, email, hoursWorked, payRate) {
    const modal = document.getElementById('updateModal');
    document.getElementById('updateId').value = id;
    document.getElementById('updateUsername').value = username;
    document.getElementById('updateEmail').value = email;
    document.getElementById('updateHours').value = hoursWorked;
    document.getElementById('updatePayRate').value = payRate;

    modal.classList.remove('hidden');
}

function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    modal.classList.add('hidden');
}

async function saveUpdatedData() {
    const id = document.getElementById('updateId').value;
    const username = document.getElementById('updateUsername').value;
    const email = document.getElementById('updateEmail').value;
    const hoursWorked = document.getElementById('updateHours').value;
    const payRate = document.getElementById('updatePayRate').value;

    const response = await fetch(`/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, hoursWorked, payRate }),
    });

    if (response.ok) {
        alert('Employee updated successfully!');
        closeUpdateModal();
        location.reload(); // Actualiza la tabla
    } else {
        alert('Error updating employee.');
    }
}

async function deleteEmployee() {
    const id = document.getElementById('updateId').value;

    if (confirm('¿Estás seguro de eliminar este empleado?')) {
        const response = await fetch(`/delete/${id}`, { method: 'POST' });

        if (response.ok) {
            alert('Empleado eliminado exitosamente');
            closeUpdateModal();
            location.reload();
        } else {
            alert('Error al eliminar empleado.');
        }
    }
}
