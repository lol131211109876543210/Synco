# Synco

Plantilla de trabajo con Node.js, React, Vite y CSS nativo. Incluye inicio de sesión de demostración, dashboard y galería navegables.

## Inicio rápido

### 1. Comprueba Node.js y npm

```bash
node --version
npm --version
```

Si ambos comandos muestran una versión y Node.js es `20.19` o superior dentro de la rama 20, o `22.12` o superior, ya puedes continuar. Si `node` o `npm` no se reconoce, instala la versión LTS desde [nodejs.org](https://nodejs.org/), cierra y vuelve a abrir la terminal y repite la comprobación. npm se instala junto con Node.js.

### 2. Instala y ejecuta Synco

Abre la terminal en la raíz del proyecto. En este entorno, la ruta es:

```bash
cd /workspaces/Synco
```

# -Tejada: Al parecer al inciar el proyecto se debe ejecutar esto para ejecutarlo
```bash
export PATH="/tmp/node-v22.23.4-linux-x64-musl/bin:$PATH"
node --version
npm --version
npm install
npm run dev
```

Si clonaste el proyecto en otro lugar, reemplaza la ruta por la carpeta donde está `package.json`. Desde esa raíz, instala las dependencias una sola vez:

```bash
npm install
```

Cada vez que quieras iniciar la app, ejecuta:

```bash
npm run dev
```

Abre en el navegador la URL local que Vite imprime en la terminal, normalmente `http://localhost:5173/`. Para detener el servidor, pulsa `Ctrl+C` en esa terminal. Para generar y revisar la versión de producción, ejecuta `npm run build` y después `npm run preview`.

El formulario permite entrar a la demo con cualquier correo y contraseña válidos; no autentica contra un servidor.

## Mapa del código

En `Synco_rewrite/javascript/main.jsx`, lee de arriba hacia abajo:

- Imports: cargan React, el montaje del DOM y la hoja de estilos.
- `projects` y `galleryItems`: datos de ejemplo para las tarjetas. Cambia aquí títulos, categorías, descripciones e imágenes.
- `Brand()`: muestra el nombre y símbolo reutilizable de Synco.
- `Login({ onLogin })`: dibuja el formulario; al enviarlo llama `onLogin` para cambiar de vista. La validación es solo del navegador.
- `Navigation({ view, setView, onLogout })`: muestra los botones de navegación y permite volver al acceso.
- `Dashboard({ goToGallery, projectList })`: presenta indicadores y recibe la lista de proyectos como propiedades.
- `Gallery({ onChoose })`: filtra `galleryItems` por categoría y avisa a `App` cuando se elige un recurso.
- `App()`: mantiene la pantalla actual, los proyectos agregados y el aviso temporal. `chooseResource(title)` crea una tarjeta a partir del elemento seleccionado.
- `createRoot(...).render(...)`: conecta el componente principal con `#root` del HTML.

Otros archivos de entrada y presentación:

- `Synco_rewrite/index.html`: metadatos, fuentes, contenedor `#root` y carga del módulo React.
- `Synco_rewrite/css/styles.css`: variables de tema al inicio; estilos agrupados por pantalla y breakpoints al final.
- `package.json`: `dev` inicia Vite, `build` compila y `preview` sirve la compilación.

Para entrar a la carpeta que contiene el HTML, React y CSS:

```bash
cd /workspaces/Synco/Synco_rewrite
```

Los comandos `npm run dev`, `npm run build` y `npm run preview` se ejecutan desde `/workspaces/Synco`, no desde `Synco_rewrite`.

## Guía para la próxima sesión

- Cambia los nombres, textos e imágenes de ejemplo en los arreglos `projects` y `galleryItems` de `main.jsx`.
- Ajusta los colores y tipografías en `:root` de `styles.css`; cada pantalla tiene su propio bloque comentado.
- Las vistas React se encuentran en `Login`, `Dashboard` y `Gallery`; `App` conserva el estado y coordina la navegación.
- Los cortes responsive están al final de `styles.css` en `1050px`, `760px` y `520px`.
- El formulario solo simula el acceso. Para autenticar, conecta `Login` a un endpoint y gestiona la sesión en `App`.