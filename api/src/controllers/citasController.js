const citasService = require('../services/citasService');

// Capa de presentación HTTP: traduce request/response, delega al service.

async function listar(req, res, next) {
    try {
        const { doctor_id: doctorId, paciente_id: pacienteId, desde, hasta } = req.query;
        const citas = await citasService.listarCitas({ doctorId, pacienteId, desde, hasta });
        res.json(citas);
    } catch (err) {
        next(err);
    }
}

async function obtener(req, res, next) {
    try {
        const cita = await citasService.obtenerCita(req.params.id);
        res.json(cita);
    } catch (err) {
        next(err);
    }
}

async function crear(req, res, next) {
    try {
        const { paciente_id: pacienteId, doctor_id: doctorId, inicio, fin, motivo } = req.body;
        const cita = await citasService.crearCita({ pacienteId, doctorId, inicio, fin, motivo });
        res.status(201).json(cita);
    } catch (err) {
        next(err);
    }
}

async function reprogramar(req, res, next) {
    try {
        const { inicio, fin } = req.body;
        const cita = await citasService.reprogramarCita(req.params.id, { inicio, fin });
        res.json(cita);
    } catch (err) {
        next(err);
    }
}

async function cambiarEstado(req, res, next) {
    try {
        const { estado } = req.body;
        const cita = await citasService.cambiarEstadoCita(req.params.id, estado);
        res.json(cita);
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, obtener, crear, reprogramar, cambiarEstado };
