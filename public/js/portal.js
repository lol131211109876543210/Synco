document.addEventListener('DOMContentLoaded', () => {
    // Extraer el token único de la URL (ej: /portal/TOKEN_AQUÍ)
    const pathSegments = window.location.pathname.split('/');
    const token = pathSegments[pathSegments.length - 1];

    const nombreAspiranteEl = document.getElementById('nombreAspirante');
    const vacanteTituloEl = document.getElementById('vacanteTitulo');
    const listaDocumentos = document.getElementById('listaDocumentos');
    const enviarExpedienteBtn = document.getElementById('enviarExpedienteBtn');

    let aspiranteId = null;

    if (!token) {
        alert('Enlace de acceso no válido.');
        return;
    }

    // Cargar datos iniciales del portal del aspirante
    cargarDatosPortal();

    async function cargarDatosPortal() {
        try {
            const response = await fetch(`/api/aspirantes/portal/${token}`);
            const data = await response.json();

            if (response.ok) {
                aspiranteId = data.aspirante.id;
                
                if (nombreAspiranteEl) nombreAspiranteEl.textContent = data.aspirante.nombre_completo;
                if (vacanteTituloEl) vacanteTituloEl.textContent = data.aspirante.vacante_titulo;

                renderizarDocumentos(data.documentos);
            } else {
                alert(data.error || 'No se pudo cargar la información del portal');
            }
        } catch (error) {
            console.error('Error de red al cargar el portal:', error);
        }
    }

    // Renderizar la lista de documentos requeridos y sus controles de subida
    function renderizarDocumentos(documentos) {
        if (!listaDocumentos) return;
        listaDocumentos.innerHTML = '';

        if (documentos.length === 0) {
            listaDocumentos.innerHTML = '<p>No hay documentos requeridos asignados.</p>';
            return;
        }

        documentos.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'documento-item card mb-3 p-3 shadow-sm';
            item.innerHTML = `
                <h5>${doc.tipo_documento.replace('_', ' ').toUpperCase()}</h5>
                <p>Estado: <span class="badge ${doc.estado === 'subido' ? 'bg-success' : 'bg-warning text-dark'}">${doc.estado}</span></p>
                <p>Archivo actual: <strong>${doc.nombre_archivo || 'Ninguno'}</strong></p>
                <div class="mb-2">
                    <input type="file" class="form-control file-input" data-tipo="${doc.tipo_documento}" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                </div>
                <button class="btn btn-primary btn-sm subir-archivo-btn" data-tipo="${doc.tipo_documento}">Subir / Actualizar Archivo</button>
            `;
            listaDocumentos.appendChild(item);
        });

        // Activar eventos para los botones de carga de cada documento individual
        document.querySelectorAll('.subir-archivo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipoDoc = e.target.getAttribute('data-tipo');
                const fileInput = document.querySelector(`.file-input[data-tipo="${tipoDoc}"]`);
                
                if (fileInput.files.length === 0) {
                    alert('Por favor, seleccione un archivo antes de presionar subir.');
                    return;
                }

                subirArchivoIndividual(tipoDoc, fileInput.files[0]);
            });
        });
    }

    // Enviar el archivo individual al backend usando FormData y Multer
    async function subirArchivoIndividual(tipoDocumento, archivo) {
        const formData = new FormData();
        formData.append('aspirante_id', aspiranteId);
        formData.append('tipo_documento', tipoDocumento);
        formData.append('archivo', archivo);
        formData.append('nombre_archivo', archivo.name);

        try {
            const response = await fetch('/api/aspirantes/subir-documento', {
                method: 'POST',
                body: formData // Importante: no definir 'Content-Type' para que el navegador asigne el boundary multipart automáticamente
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);
                cargarDatosPortal(); // Recargar el portal para actualizar estados y badges
            } else {
                alert(data.error || 'Error al procesar la carga del documento');
            }
        } catch (error) {
            console.error('Error de red al subir archivo:', error);
            alert('Error de conexión con el servidor.');
        }
    }

    // Finalizar el proceso y enviar el expediente completo a Recursos Humanos
    if (enviarExpedienteBtn) {
        enviarExpedienteBtn.addEventListener('click', async () => {
            if (!confirm('¿Está seguro de enviar su expediente definitivo a Recursos Humanos? Una vez enviado no podrá realizar modificaciones.')) return;

            try {
                const response = await fetch(`/api/aspirantes/enviar/${aspiranteId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.mensaje);
                    window.location.reload();
                } else {
                    alert(data.error || 'Error al enviar el expediente');
                }
            } catch (error) {
                console.error('Error al enviar expediente:', error);
            }
        });
    }
});