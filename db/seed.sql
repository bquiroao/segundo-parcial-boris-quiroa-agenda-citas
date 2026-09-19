-- Datos semilla mínimos para pruebas del módulo de citas
SET NAMES utf8mb4;

INSERT INTO doctores (nombre, especialidad, email) VALUES
    ('Dra. Ana López', 'Medicina General', 'ana.lopez@hospital.test'),
    ('Dr. Carlos Méndez', 'Pediatría', 'carlos.mendez@hospital.test'),
    ('Dra. Lucía Ramírez', 'Cardiología', 'lucia.ramirez@hospital.test');

INSERT INTO pacientes (nombre, dpi, telefono, email) VALUES
    ('Boris Quiroa', '2900123456789', '55501010', 'boris@example.test'),
    ('María Fernández', '2900987654321', '55502020', 'maria@example.test'),
    ('José Pérez', '2900555555555', '55503030', 'jose@example.test');

INSERT INTO citas (paciente_id, doctor_id, inicio, fin, motivo, estado) VALUES
    (1, 1, '2026-09-22 09:00:00', '2026-09-22 09:30:00', 'Control general', 'confirmada'),
    (2, 2, '2026-09-22 10:00:00', '2026-09-22 10:30:00', 'Consulta pediátrica', 'pendiente'),
    (3, 3, '2026-09-23 11:00:00', '2026-09-23 11:45:00', 'Chequeo cardiológico', 'pendiente');
