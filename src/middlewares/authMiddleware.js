const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez del token JWT en peticiones protegidas.
 */
module.exports = function (req, res, next) {
    // 1. Obtener el encabezado 'Authorization' de la petición HTTP
    const authHeader = req.headers['authorization'];

    // Los tokens se envían con el formato estándar "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no existe token en la petición, denegar el acceso (401 Unauthorized)
    if (!token) {
        return res.status(401).json({ 
            error: 'Acceso denegado. No se proporcionó un token de autenticación.' 
        });
    }

    try {
        // 3. Verificar y decodificar el token usando la clave secreta
        const secretKey = process.env.JWT_SECRET || 'synco_clave_secreta';
        const decoded = jwt.verify(token, secretKey);

        // 4. Adjuntar la información decodificada del usuario al objeto 'req'
        req.usuario = decoded;

        // 5. Dar paso al siguiente handler o controlador de la ruta
        next();

    } catch (error) {
        console.error('Error al verificar JWT:', error.message);
        return res.status(403).json({ 
            error: 'Token inválido o expirado. Por favor, inicie sesión nuevamente.' 
        });
    }
};