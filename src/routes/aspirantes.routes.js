const express = require('express');
const router = express.Router();
const aspirantesController = require('../controllers/aspirantesController');
const upload = require('../middlewares/upload');

// GET /api/aspirantes/portal/:token
// Acceso público mediante el token temporal único del aspirante
router.get('/portal/:token', aspirantesController.obtenerPortalAspirante);

// POST /api/aspirantes/subir-documento
// Carga de archivo individual (procesado con el middleware Multer)
router.post('/subir-documento', upload.single('archivo'), aspirantesController.subirDocumento);

// POST /api/aspirantes/enviar/:aspirante_id
// Finalizar la carga y enviar el paquete completo de documentos a RRHH
router.post('/enviar/:aspirante_id', aspirantesController.enviarExpediente);

module.exports = router;