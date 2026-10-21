const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Verificar y crear el directorio de almacenamiento 'uploads'
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configurar el almacenamiento en disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const tipoDoc = req.body.tipo_documento || 'doc';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Genera un nombre limpio y único: tipo_timestamp.ext
        cb(null, `${tipoDoc}_${timestamp}${ext}`);
    }
});

// 3. Filtro de seguridad por extensión y tipo MIME
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx/;
    const allowedMimeTypes = /image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Formato no permitido. Solo se aceptan PDF, JPG, PNG, DOC o DOCX.'), false);
    }
};

// 4. Instancia de Multer configurada
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Límite de 10 MB
    },
    fileFilter: fileFilter
});

module.exports = upload;