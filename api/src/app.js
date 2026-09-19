const express = require('express');
const cors = require('cors');
const path = require('path');

const citasRoutes = require('./routes/citasRoutes');
const doctoresRoutes = require('./routes/doctoresRoutes');
const pacientesRoutes = require('./routes/pacientesRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.use('/api/citas', citasRoutes);
app.use('/api/doctores', doctoresRoutes);
app.use('/api/pacientes', pacientesRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
