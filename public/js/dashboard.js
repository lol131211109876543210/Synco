document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado comprobando el token en localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Elementos del DOM
    const logoutBtn = document.getElementById('logoutBtn');
    const tablaAspirantes = document.getElementById('tablaAspirantes');
    
    // Cargar datos iniciales al abrir el panel
    cargarExpedientes();

    // 1. Funcionalidad de Cerrar Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login.html';
        });
    }

    // 2. Función para obtener y renderizar la lista de expedientes desde la API
    async function cargarExpedientes() {
        try {
            const response = await fetch('/api/expedientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                // Token expirado o inválido
                alert('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
                localStorage.clear();
                window.location.href = '/login.html';
                return;
            }

            const aspirantes = await response.json();
            renderizarTabla(aspirantes);

        } catch (error) {
            console.error('Error al cargar expedientes:', error);
        }
    }

    // 3. Renderizar filas dinámicamente en la tabla HTML
    function renderizarTabla(aspirantes) {
        if (!tablaAspirantes) return;

        tablaAspirantes.innerHTML = '';

        if (aspirantes.length === 0) {
            tablaAspirantes.innerHTML = '<tr><td colspan="5" class="text-center">No hay aspirantes registrados.</td></tr>';
            return;
        }

        aspirantes.forEach(asp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${asp.nombre_completo}</td>
                <td>${asp.numero_documento}</td>
                <td>${asp.vacante_titulo || 'N/A'}</td>
                <td><span class="badge estado-${asp.estado_proceso}">${asp.estado_proceso}</span></td>
                <td>
                    <button class="btn btn-sm btn-success aprobar-btn" data-id="${asp.id}">Aprobado</button>
                    <button class="btn btn-sm btn-danger rechazar-btn" data-id="${asp.id}">Rechazar</button>
                </td>
            `;
            tablaAspirantes.appendChild(tr);
        });

        // Agregar eventos a los botones generados dinámicamente
        document.querySelectorAll('.aprobar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => aprobarAspirante(e.target.getAttribute('data-id')));
        });

        document.querySelectorAll('.rechazar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => rechazarAspirante(e.target.getAttribute('data-id')));
        });
    }

    // 4. Acción para aprobar expediente
    async function aprobarAspirante(id) {
        if (!confirm('¿Está seguro de aprobar este expediente y registrarlo como empleado activo?')) return;

        try {
            const response = await fetch(`/api/expedientes/aprobar/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);
                cargarExpedientes(); // Recargar la tabla
            } else {
                alert(data.error || 'Error al aprobar el expediente');
            }
        } catch (error) {
            console.error('Error de red al aprobar:', error);
        }
    }

    // 5. Acción para rechazar expediente (exigiendo motivo)
    async function rechazarAspirante(id) {
        const motivo = prompt('Por favor, ingrese el motivo obligatorio del rechazo:');
        if (!motivo) {
            alert('El motivo es obligatorio para rechazar un expediente.');
            return;
        }

        try {
            const response = await fetch(`/api/expedientes/rechazar/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motivo })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);
                cargarExpedientes(); // Recargar la tabla
            } else {
                alert(data.error || 'Error al rechazar el expediente');
            }
        } catch (error) {
            console.error('Error de red al rechazar:', error);
        }
    }
});