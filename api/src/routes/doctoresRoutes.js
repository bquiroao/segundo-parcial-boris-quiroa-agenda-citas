const { Router } = require('express');
const doctoresController = require('../controllers/doctoresController');

const router = Router();
router.get('/', doctoresController.listar);

module.exports = router;
