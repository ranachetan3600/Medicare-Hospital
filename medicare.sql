CREATE DATABASE IF NOT EXISTS medicare_db;
USE medicare_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    qualification VARCHAR(100),
    experience_years INT,
    fee DECIMAL(10, 2),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 3. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('Confirmed', 'Pending', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and vascular health care'),
('Neurology', 'Brain and nervous system treatment'),
('Orthopedics', 'Bone, joint, and muscle care'),
('Pediatrics', 'Comprehensive care for children');

INSERT INTO doctors (name, department_id, qualification, experience_years, fee) VALUES
('Dr. Rajesh Sharma', 1, 'MD, DM (Cardiology)', 15, 800.00),
('Dr. Ananya Iyer', 2, 'MD, DM (Neurology)', 12, 1000.00),
('Dr. Vikram Verma', 3, 'MS (Orthopedics)', 10, 700.00),
('Dr. Sneha Patel', 4, 'MD (Pediatrics)', 8, 600.00);

SELECT*FROM departments;
SELECT*FROM doctors;