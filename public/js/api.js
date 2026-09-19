// Capa de acceso a la API desde el navegador: única responsable de fetch().
// No conoce FullCalendar ni el DOM (RQNF-04: no mezclar capas).

const ApiClient = (() => {
    const BASE = '/api';

    async function manejarRespuesta(res) {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data.error || `Error HTTP ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return data;
    }

    return {
        listarCitas(filtros = {}) {
            const params = new URLSearchParams(filtros);
            return fetch(`${BASE}/citas?${params}`).then(manejarRespuesta);
        },
        obtenerCita(id) {
            return fetch(`${BASE}/citas/${id}`).then(manejarRespuesta);
        },
        crearCita(payload) {
            return fetch(`${BASE}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(manejarRespuesta);
        },
        reprogramarCita(id, payload) {
            return fetch(`${BASE}/citas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(manejarRespuesta);
        },
        cambiarEstado(id, estado) {
            return fetch(`${BASE}/citas/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado }),
            }).then(manejarRespuesta);
        },
        listarDoctores() {
            return fetch(`${BASE}/doctores`).then(manejarRespuesta);
        },
        listarPacientes() {
            return fetch(`${BASE}/pacientes`).then(manejarRespuesta);
        },
    };
})();
