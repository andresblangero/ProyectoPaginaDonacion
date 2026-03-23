-- Database Schema for Blood Donation Platform

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    blood_type VARCHAR(5),
    location VARCHAR(255),
    is_available BOOLEAN DEFAULT false,
    reputation_points INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'donor', -- 'donor', 'hospital', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blood_requests (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES users(id),
    blood_type_needed VARCHAR(5) NOT NULL,
    quantity_needs INTEGER DEFAULT 1,
    urgency_level VARCHAR(20) DEFAULT 'media', -- 'baja', 'media', 'alta'
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'activa', -- 'activa', 'completada', 'cancelada'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES users(id),
    request_id INTEGER REFERENCES blood_requests(id),
    status VARCHAR(50) DEFAULT 'programada', -- 'programada', 'completada', 'ausente'
    scheduled_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
