const mysql = require('mysql2/promise');

// Capa de configuración: única responsable de crear el pool de conexiones.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'hospital_app',
    password: process.env.DB_PASSWORD || 'hospital_app_pass',
    database: process.env.DB_NAME || 'hospital_citas',
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
});

module.exports = pool;
