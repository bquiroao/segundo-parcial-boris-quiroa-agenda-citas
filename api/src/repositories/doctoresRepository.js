const pool = require('../config/db');

async function listar() {
    const [rows] = await pool.query('SELECT * FROM doctores WHERE activo = TRUE ORDER BY nombre ASC');
    return rows;
}

async function existe(id) {
    const [rows] = await pool.query('SELECT id FROM doctores WHERE id = ?', [id]);
    return rows.length > 0;
}

module.exports = { listar, existe };
