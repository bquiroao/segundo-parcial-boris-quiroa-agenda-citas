// Capa de presentación: maneja FullCalendar y el DOM. Delega toda
// comunicación con el servidor a ApiClient (RQNF-04).

document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('modalCita');
    const form = document.getElementById('formCita');
    const formError = document.getElementById('formError');
    const detalleEstado = document.getElementById('detalleEstado');
    const estadoActualEl = document.getElementById('estadoActual');
    const selectDoctor = document.getElementById('doctorId');
    const selectPaciente = document.getElementById('pacienteId');
    const filtroDoctor = document.getElementById('filtroDoctor');

    let doctores = [];
    let pacientes = [];

    function toInputLocal(fechaSql) {
        // 'YYYY-MM-DD HH:mm:ss' -> 'YYYY-MM-DDTHH:mm' para <input datetime-local>
        return fechaSql.replace(' ', 'T').slice(0, 16);
    }

    function poblarSelect(select, items, primeraOpcion) {
        select.innerHTML = '';
        if (primeraOpcion) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = primeraOpcion;
            select.appendChild(opt);
        }
        items.forEach((item) => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.nombre;
            select.appendChild(opt);
        });
    }

    async function cargarCatalogos() {
        [doctores, pacientes] = await Promise.all([
            ApiClient.listarDoctores(),
            ApiClient.listarPacientes(),
        ]);
        poblarSelect(selectDoctor, doctores);
        poblarSelect(selectPaciente, pacientes);
        poblarSelect(filtroDoctor, doctores, 'Todos');
    }

    function limpiarFormulario() {
        form.reset();
        document.getElementById('citaId').value = '';
        detalleEstado.classList.add('oculto');
        formError.classList.add('oculto');
        formError.textContent = '';
        document.getElementById('modalTitulo').textContent = 'Nueva cita';
    }

    function abrirModal() {
        modal.classList.remove('oculto');
    }
    function cerrarModal() {
        modal.classList.add('oculto');
        limpiarFormulario();
    }

    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);

    const calendarEl = document.getElementById('calendario');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
        },
        height: 'auto',
        editable: true, // habilita drag & drop (RQF-04)
        eventSources: [
            async (info, successCallback, failureCallback) => {
                try {
                    const filtros = {
                        desde: info.startStr.slice(0, 10),
                        hasta: info.endStr.slice(0, 10),
                    };
                    if (filtroDoctor.value) filtros.doctor_id = filtroDoctor.value;
                    const citas = await ApiClient.listarCitas(filtros);
                    successCallback(
                        citas.map((c) => ({
                            id: String(c.id),
                            title: `${c.motivo}`,
                            start: c.inicio.replace(' ', 'T'),
                            end: c.fin.replace(' ', 'T'),
                            classNames: [`estado-${c.estado}`],
                            extendedProps: c,
                        }))
                    );
                } catch (err) {
                    failureCallback(err);
                }
            },
        ],
        // RQF-01 / RQF-09: crear cita al seleccionar un rango vacío del calendario.
        selectable: true,
        select(info) {
            limpiarFormulario();
            document.getElementById('inicio').value = toInputLocal(
                info.startStr.slice(0, 16).replace('T', ' ')
            );
            document.getElementById('fin').value = toInputLocal(
                info.endStr.slice(0, 16).replace('T', ' ')
            );
            abrirModal();
        },
        // RQF-09: mostrar detalle al hacer clic en un evento existente.
        eventClick(info) {
            const cita = info.event.extendedProps;
            limpiarFormulario();
            document.getElementById('modalTitulo').textContent = `Cita #${cita.id}`;
            document.getElementById('citaId').value = cita.id;
            selectPaciente.value = cita.paciente_id;
            selectDoctor.value = cita.doctor_id;
            document.getElementById('inicio').value = toInputLocal(cita.inicio);
            document.getElementById('fin').value = toInputLocal(cita.fin);
            document.getElementById('motivo').value = cita.motivo;
            detalleEstado.classList.remove('oculto');
            estadoActualEl.textContent = cita.estado;
            abrirModal();
        },
        // RQF-04: reprogramar con drag & drop, sincronizando con la API.
        async eventDrop(info) {
            try {
                await ApiClient.reprogramarCita(info.event.id, {
                    inicio: info.event.startStr.slice(0, 16).replace('T', ' '),
                    fin: info.event.endStr.slice(0, 16).replace('T', ' '),
                });
                calendar.refetchEvents();
            } catch (err) {
                alert(`No se pudo reprogramar: ${err.message}`);
                info.revert();
            }
        },
        async eventResize(info) {
            try {
                await ApiClient.reprogramarCita(info.event.id, {
                    inicio: info.event.startStr.slice(0, 16).replace('T', ' '),
                    fin: info.event.endStr.slice(0, 16).replace('T', ' '),
                });
                calendar.refetchEvents();
            } catch (err) {
                alert(`No se pudo reprogramar: ${err.message}`);
                info.revert();
            }
        },
    });

    calendar.render();

    filtroDoctor.addEventListener('change', () => calendar.refetchEvents());

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.classList.add('oculto');
        const citaId = document.getElementById('citaId').value;
        const payload = {
            paciente_id: Number(selectPaciente.value),
            doctor_id: Number(selectDoctor.value),
            inicio: document.getElementById('inicio').value.replace('T', ' '),
            fin: document.getElementById('fin').value.replace('T', ' '),
            motivo: document.getElementById('motivo').value,
        };
        try {
            if (citaId) {
                await ApiClient.reprogramarCita(citaId, { inicio: payload.inicio, fin: payload.fin });
            } else {
                await ApiClient.crearCita(payload);
            }
            calendar.refetchEvents();
            cerrarModal();
        } catch (err) {
            formError.textContent = err.message;
            formError.classList.remove('oculto');
        }
    });

    detalleEstado.querySelectorAll('button[data-estado]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const citaId = document.getElementById('citaId').value;
            try {
                await ApiClient.cambiarEstado(citaId, btn.dataset.estado);
                calendar.refetchEvents();
                cerrarModal();
            } catch (err) {
                formError.textContent = err.message;
                formError.classList.remove('oculto');
            }
        });
    });

    await cargarCatalogos();
});
