const doctoresRepository = require('../repositories/doctoresRepository');

async function listar(req, res, next) {
    try {
        res.json(await doctoresRepository.listar());
    } catch (err) {
        next(err);
    }
}

module.exports = { listar };
