const citasRepository = require('../repositories/citasRepository');
const doctoresRepository = require('../repositories/doctoresRepository');
const pacientesRepository = require('../repositories/pacientesRepository');
const { ValidationError, NotFoundError, ConflictError } = require('./errors');

// Capa de lógica de negocio: validaciones de dominio y reglas de la cita.
// No conoce Express (req/res) ni SQL directamente.

const FECHA_HORA_REGEX = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/;

function normalizarFecha(valor) {
    return typeof valor === 'string' ? valor.replace('T', ' ') : valor;
}

async function validarDatosCita({ pacienteId, doctorId, inicio, fin, motivo }) {
    if (!pacienteId || !doctorId || !inicio || !fin || !motivo) {
        throw new ValidationError('paciente_id, doctor_id, inicio, fin y motivo son obligatorios.');
    }
    if (!FECHA_HORA_REGEX.test(inicio) || !FECHA_HORA_REGEX.test(fin)) {
        throw new ValidationError('inicio y fin deben tener formato de fecha/hora válido (YYYY-MM-DD HH:mm).');
    }
    if (new Date(normalizarFecha(fin)) <= new Date(normalizarFecha(inicio))) {
        throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio.');
    }
    if (!(await pacientesRepository.existe(pacienteId))) {
        throw new ValidationError(`No existe el paciente con id ${pacienteId}.`);
    }
    if (!(await doctoresRepository.existe(doctorId))) {
        throw new ValidationError(`No existe el doctor con id ${doctorId}.`);
    }
}

async function verificarDisponibilidad({ doctorId, inicio, fin, excluirCitaId }) {
    const conflictos = await citasRepository.buscarConflictos({
        doctorId,
        inicio: normalizarFecha(inicio),
        fin: normalizarFecha(fin),
        excluirCitaId,
    });
    if (conflictos.length > 0) {
        throw new ConflictError(
            `El doctor ya tiene una cita activa que se solapa con el horario solicitado (cita #${conflictos[0].id}).`
        );
    }
}

async function listarCitas(filtros) {
    return citasRepository.listar(filtros);
}

async function obtenerCita(id) {
    const cita = await citasRepository.obtenerPorId(id);
    if (!cita) throw new NotFoundError(`No existe la cita con id ${id}.`);
    return cita;
}

async function crearCita(datos) {
    await validarDatosCita(datos);
    // RQNF-07: la validación de disponibilidad se ejecuta en el servidor.
    await verificarDisponibilidad(datos);
    return citasRepository.crear(datos);
}

async function reprogramarCita(id, { inicio, fin }) {
    const cita = await obtenerCita(id);
    if (!inicio || !fin) {
        throw new ValidationError('inicio y fin son obligatorios para reprogramar.');
    }
    if (!FECHA_HORA_REGEX.test(inicio) || !FECHA_HORA_REGEX.test(fin)) {
        throw new ValidationError('inicio y fin deben tener formato de fecha/hora válido.');
    }
    if (new Date(normalizarFecha(fin)) <= new Date(normalizarFecha(inicio))) {
        throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio.');
    }
    await verificarDisponibilidad({ doctorId: cita.doctor_id, inicio, fin, excluirCitaId: id });
    return citasRepository.actualizarHorario(id, { inicio: normalizarFecha(inicio), fin: normalizarFecha(fin) });
}

async function cambiarEstadoCita(id, nuevoEstado) {
    await obtenerCita(id);
    const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'atendida'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new ValidationError(`Estado inválido: ${nuevoEstado}.`);
    }
    return citasRepository.actualizarEstado(id, nuevoEstado);
}

module.exports = {
    listarCitas,
    obtenerCita,
    crearCita,
    reprogramarCita,
    cambiarEstadoCita,
};
