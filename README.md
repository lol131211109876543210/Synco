# SynCO – Sincronización Corporativa

Aplicación web (Node.js + Express + MySQL) para gestionar expedientes de aspirantes:
login de RRHH, vacantes, expedientes, empleados y portal del aspirante.

La base de datos se **crea sola** al arrancar (tablas + datos de ejemplo), sin ejecutar SQL a mano.

**Usuario de prueba:** `admin@synco.co` · contraseña `12345678`

## Opción 1 · GitHub Codespaces (sin instalar nada)

1. En el repositorio: **Code → Codespaces → Create codespace on main**.
2. Espera a que termine de construir; la app arranca sola y se abre el puerto **3000**.
   (Si no se abre, pestaña **Ports** → clic en el puerto 3000.)

## Opción 2 · Docker

```bash
git clone https://github.com/lol131211109876543210/Synco.git
cd Synco
docker compose up --build
```

Abre http://localhost:3000

## Opción 3 · Local (Node.js 18+ y MySQL)

```bash
git clone https://github.com/lol131211109876543210/Synco.git
cd Synco
npm install
cp .env.example .env     # en Windows: copy .env.example .env  (ajusta DB_PASSWORD)
npm start
```

Abre http://localhost:3000

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Login RRHH |
| `/admin.html` | Dashboard / administración |
| `/expedientes.html` | Expedientes de aspirantes |
| `/vacantes.html` | Vacantes |
| `/empleados.html` | Empleados |
| `/portal/<token>` | Portal del aspirante |

## Variables de entorno

Ver `.env.example`. Todas tienen valor por defecto para desarrollo; en producción define `JWT_SECRET` y `NODE_ENV=production`.
