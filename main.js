document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        patient_name: document.getElementById('patient_name').value,
        patient_email: document.getElementById('patient_email').value,
        patient_phone: document.getElementById('patient_phone').value,
        doctor_id: document.getElementById('doctor_id').value,
        appointment_date: document.getElementById('appointment_date').value,
        appointment_time: document.getElementById('appointment_time').value
    };

    try {
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Failed to book appointment.');
    }
});

async function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
        const response = await fetch(`/api/cancel/${id}`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.reload();
        }
    } catch (err) {
        console.error(err);
        alert('Failed to cancel appointment.');
    }
}