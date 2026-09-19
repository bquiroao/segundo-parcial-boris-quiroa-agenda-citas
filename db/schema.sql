-- Esquema del módulo de citas del Sistema Hospitalario Integrado
-- Cubre RQF-01, RQF-03, RQF-05, RQF-10

CREATE TABLE IF NOT EXISTS doctores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    especialidad VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    dpi VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(150),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    doctor_id INT NOT NULL,
    inicio DATETIME NOT NULL,
    fin DATETIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'atendida') NOT NULL DEFAULT 'pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_citas_doctor FOREIGN KEY (doctor_id) REFERENCES doctores(id),
    CONSTRAINT chk_citas_horario CHECK (fin > inicio),
    INDEX idx_citas_doctor_rango (doctor_id, inicio, fin),
    INDEX idx_citas_paciente (paciente_id),
    INDEX idx_citas_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
