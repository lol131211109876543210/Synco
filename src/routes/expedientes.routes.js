const express = require('express');
const router = express.Router();
const expedientesController = require('../controllers/expedientesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas de expedientes requieren autenticación JWT de RRHH

// GET /api/expedientes/
// Obtiene la lista completa de aspirantes vinculados a sus vacantes
router.get('/', authMiddleware, expedientesController.obtenerAspirantes);

// PUT /api/expedientes/aprobar/:id
// Aprueba el expediente y registra automáticamente al aspirante como empleado activo
router.put('/aprobar/:id', authMiddleware, expedientesController.aprobarExpediente);

// PUT /api/expedientes/rechazar/:id
// Rechaza el expediente exigiendo obligatoriamente un motivo
router.put('/rechazar/:id', authMiddleware, expedientesController.rechazarExpediente);

module.exports = router;