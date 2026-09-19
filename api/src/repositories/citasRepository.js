const pool = require('../config/db');

// Capa de acceso a datos: solo SQL, sin reglas de negocio.

async function listar({ doctorId, pacienteId, desde, hasta } = {}) {
    const condiciones = [];
    const params = [];

    if (doctorId) {
        condiciones.push('doctor_id = ?');
        params.push(doctorId);
    }
    if (pacienteId) {
        condiciones.push('paciente_id = ?');
        params.push(pacienteId);
    }
    if (desde) {
        condiciones.push('fin >= ?');
        params.push(desde);
    }
    if (hasta) {
        condiciones.push('inicio <= ?');
        params.push(hasta);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const [rows] = await pool.query(
        `SELECT * FROM citas ${where} ORDER BY inicio ASC`,
        params
    );
    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
    return rows[0] || null;
}

// Busca citas activas (no canceladas) del mismo doctor cuyo rango se solape.
// Excluye opcionalmente la propia cita (útil al reprogramar).
async function buscarConflictos({ doctorId, inicio, fin, excluirCitaId = null }) {
    const params = [doctorId, fin, inicio];
    let sql = `
        SELECT * FROM citas
        WHERE doctor_id = ?
          AND estado <> 'cancelada'
          AND inicio < ?
          AND fin > ?
    `;
    if (excluirCitaId) {
        sql += ' AND id <> ?';
        params.push(excluirCitaId);
    }
    const [rows] = await pool.query(sql, params);
    return rows;
}

async function crear({ pacienteId, doctorId, inicio, fin, motivo, estado = 'pendiente' }) {
    const [result] = await pool.query(
        `INSERT INTO citas (paciente_id, doctor_id, inicio, fin, motivo, estado)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pacienteId, doctorId, inicio, fin, motivo, estado]
    );
    return obtenerPorId(result.insertId);
}

async function actualizarHorario(id, { inicio, fin }) {
    await pool.query('UPDATE citas SET inicio = ?, fin = ? WHERE id = ?', [inicio, fin, id]);
    return obtenerPorId(id);
}

async function actualizarEstado(id, estado) {
    await pool.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id]);
    return obtenerPorId(id);
}

module.exports = {
    listar,
    obtenerPorId,
    buscarConflictos,
    crear,
    actualizarHorario,
    actualizarEstado,
};
