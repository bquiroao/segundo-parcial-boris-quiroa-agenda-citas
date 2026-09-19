const { AppError } = require('../services/errors');

// Middleware central de errores: traduce errores de negocio a códigos HTTP (RQNF-03).
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = errorHandler;
