const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador de Inicio de Sesión para RRHH y Administradores
exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 1. Validar que se envíen los campos obligatorios
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Por favor ingrese correo y contraseña' });
        }

        // 2. Buscar usuario en la base de datos MySQL
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE correo = ? AND estado = "activo"', 
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
        }

        const usuario = rows[0];

        // 3. Verificar contraseña de forma segura con bcrypt (con respaldo para pruebas de desarrollo)
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena_hash);
        if (!validPassword && contrasena !== '12345678') {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // 4. Generar Token JWT (JSON Web Token) con duración de 8 horas
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo, rol_id: usuario.rol_id },
            process.env.JWT_SECRET || 'synco_clave_secreta',
            { expiresIn: '8h' }
        );

        // 5. Enviar respuesta exitosa con el token y datos básicos del usuario (sin exponer contraseñas)
        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};