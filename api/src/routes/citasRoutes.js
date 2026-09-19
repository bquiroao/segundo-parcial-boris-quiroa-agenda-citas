const { Router } = require('express');
const citasController = require('../controllers/citasController');

const router = Router();

router.get('/', citasController.listar);
router.get('/:id', citasController.obtener);
router.post('/', citasController.crear);
router.put('/:id', citasController.reprogramar);
router.patch('/:id/estado', citasController.cambiarEstado);

module.exports = router;
