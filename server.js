const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Home / Dashboard
app.get('/', async (req, res) => {
    try {
        const [departments] = await db.query('SELECT * FROM departments');
        const [doctors] = await db.query(`
            SELECT d.id, d.name, d.qualification, d.experience_years, d.fee, dept.name AS department_name
            FROM doctors d
            JOIN departments dept ON d.department_id = dept.id
        `);
        const [appointments] = await db.query(`
            SELECT a.id, a.patient_name, a.patient_phone, a.appointment_date, a.appointment_time, a.status, doc.name AS doctor_name
            FROM appointments a
            JOIN doctors doc ON a.doctor_id = doc.id
            ORDER BY a.created_at DESC
        `);

        res.render('index', { departments, doctors, appointments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error');
    }
});

// Book Appointment API
app.post('/api/book', async (req, res) => {
    const { patient_name, patient_email, patient_phone, doctor_id, appointment_date, appointment_time } = req.body;

    if (!patient_name || !patient_email || !patient_phone || !doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ success: false, message: 'Please complete all fields.' });
    }

    try {
        const query = `
            INSERT INTO appointments (patient_name, patient_email, patient_phone, doctor_id, appointment_date, appointment_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [patient_name, patient_email, patient_phone, doctor_id, appointment_date, appointment_time]);

        res.json({ success: true, message: 'Appointment booked successfully!', appointmentId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while booking appointment.' });
    }
});

// Cancel Appointment API
app.post('/api/cancel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE appointments SET status = 'Cancelled' WHERE id = ?", [id]);
        res.json({ success: true, message: 'Appointment cancelled.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});