const pacientesRepository = require('../repositories/pacientesRepository');

async function listar(req, res, next) {
    try {
        res.json(await pacientesRepository.listar());
    } catch (err) {
        next(err);
    }
}

module.exports = { listar };
