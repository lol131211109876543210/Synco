document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue por defecto

            const correo = document.getElementById('correo').value.trim();
            const contrasena = document.getElementById('contrasena').value.trim();

            // Validación básica en el cliente
            if (!correo || !contrasena) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            try {
                // Petición HTTP POST hacia nuestra API backend de autenticación
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo, contrasena })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar el token JWT y los datos del usuario en el localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));

                    // Redirigir al panel principal de expedientes
                    window.location.href = '/expedientes.html';
                } else {
                    // Mostrar mensaje de error devuelto por el backend
                    alert(data.error || 'Credenciales inválidas');
                }

            } catch (error) {
                console.error('Error de red al intentar iniciar sesión:', error);
                alert('No se pudo conectar con el servidor. Intente más tarde.');
            }
        });
    }
});