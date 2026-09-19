const { Router } = require('express');
const pacientesController = require('../controllers/pacientesController');

const router = Router();
router.get('/', pacientesController.listar);

module.exports = router;
