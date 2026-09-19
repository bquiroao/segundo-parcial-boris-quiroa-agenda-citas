# Pruebas manuales — validación de conflictos y estados

Casos cubiertos por `verificarDisponibilidad` y `TRANSICIONES_PERMITIDAS`,
pensados para ejecutarse con curl contra la API levantada (ver EVIDENCIA.md
para la salida real capturada):

1. Crear cita para doctor 1 de 09:00 a 09:30 → 201.
2. Crear otra cita para el mismo doctor 1 de 09:15 a 09:45 (se solapa) → 409.
3. Crear cita para doctor 1 de 09:30 a 10:00 (contigua, sin solape) → 201.
4. Cambiar estado de una cita pendiente a 'atendida' directamente → 400
   (transición no permitida; primero debe pasar por 'confirmada').
5. Cambiar estado de 'pendiente' a 'cancelada' → 200.
6. Intentar reprogramar una cita cancelada → 400.
