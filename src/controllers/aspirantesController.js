const pool = require('../../config/db');

// 1. Obtener la información del portal y los documentos del aspirante mediante su token único
exports.obtenerPortalAspirante = async (req, res) => {
    try {
        const { token } = req.params;

        // Buscar al aspirante usando su token de acceso temporal y traer datos de su vacante
        const [aspiranteRows] = await pool.query(`
            SELECT a.*, v.titulo as vacante_titulo, v.departamento, v.ciudad 
            FROM aspirantes a
            JOIN vacantes v ON a.vacante_id = v.id
            WHERE a.token_acceso = ?
        `, [token]);

        if (aspiranteRows.length === 0) {
            return res.status(404).json({ error: 'Enlace de acceso inválido, expirado o inexistente' });
        }

        const aspirante = aspiranteRows[0];

        // Obtener la lista de documentos asociados a este aspirante
        const [documentos] = await pool.query(`
            SELECT * FROM documentos WHERE aspirante_id = ?
        `, [aspirante.id]);

        res.json({
            aspirante,
            documentos
        });

    } catch (error) {
        console.error('Error al cargar portal de aspirante:', error);
        res.status(500).json({ error: 'Error al cargar los datos del portal' });
    }
};

// 2. Registrar la subida o actualización de un documento del aspirante
exports.subirDocumento = async (req, res) => {
    try {
        const { aspirante_id, tipo_documento, nombre_archivo } = req.body;

        if (!aspirante_id || !tipo_documento || !nombre_archivo) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para registrar el documento' });
        }

        // Verificar si ya existe un registro previo para este tipo de documento
        const [existing] = await pool.query(
            'SELECT id FROM documentos WHERE aspirante_id = ? AND tipo_documento = ?',
            [aspirante_id, tipo_documento]
        );

        if (existing.length > 0) {
            // Si ya existe, actualizamos el archivo y la fecha de carga
            await pool.query(
                'UPDATE documentos SET nombre_archivo = ?, estado = "subido", fecha_carga = NOW() WHERE id = ?',
                [nombre_archivo, existing[0].id]
            );
        } else {
            // Si es nuevo, lo insertamos con estado 'subido'
            await pool.query(
                'INSERT INTO documentos (aspirante_id, tipo_documento, nombre_archivo, estado) VALUES (?, ?, ?, "subido")',
                [aspirante_id, tipo_documento, nombre_archivo]
            );
        }

        res.json({ mensaje: 'Documento subido y procesado correctamente' });

    } catch (error) {
        console.error('Error al subir documento:', error);
        res.status(500).json({ error: 'Error al procesar la carga del documento' });
    }
};

// 3. Finalizar y enviar el expediente completo a Recursos Humanos
exports.enviarExpediente = async (req, res) => {
    try {
        const { aspirante_id } = req.params;

        // Actualizar el estado del proceso del aspirante a 'pendiente' para que aparezca en el panel de RRHH
        await pool.query(
            'UPDATE aspirantes SET estado_proceso = "pendiente" WHERE id = ?',
            [aspirante_id]
        );

        res.json({ mensaje: 'Expediente enviado exitosamente a Recursos Humanos' });

    } catch (error) {
        console.error('Error al enviar expediente:', error);
        res.status(500).json({ error: 'Error al finalizar el envío del expediente' });
    }
};