import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../css/styles.css";

// Datos de ejemplo que alimentan las tarjetas de proyectos del dashboard.
// Para cambiar el contenido inicial, edita estos objetos; cada imagen usa una URL externa.
const projects = [
  { title: "Identidad de marca", kind: "Branding", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85", people: "4 integrantes", status: "En progreso" },
  { title: "Espacio editorial", kind: "Diseño web", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", people: "2 integrantes", status: "En revisión" },
  { title: "Campaña de otoño", kind: "Contenido", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85", people: "6 integrantes", status: "En progreso" },
];

// Recursos que aparecen en la galería. La categoría se usa también para filtrar;
// conserva sus nombres sincronizados con la lista `filters` de Gallery.
const galleryItems = [
  { title: "Identidad esencial", category: "Branding", description: "Un punto de partida claro para construir una marca coherente.", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85", time: "Plantilla · 8 bloques" },
  { title: "Portafolio visual", category: "Diseño", description: "Una galería flexible para presentar proyectos y procesos.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85", time: "Colección · 12 elementos" },
  { title: "Calendario editorial", category: "Contenido", description: "Organiza ideas, responsables y fechas en un mismo lugar.", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85", time: "Tablero · 4 semanas" },
  { title: "Moodboard natural", category: "Inspiración", description: "Reúne referencias de color, material y fotografía.", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85", time: "Lienzo · 16 referencias" },
  { title: "Sprint de producto", category: "Diseño", description: "Define el reto y convierte ideas en próximos pasos.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", time: "Guía · 5 etapas" },
  { title: "Kit de lanzamiento", category: "Branding", description: "Prepara las piezas clave para presentar una nueva idea.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85", time: "Colección · 9 piezas" },
];

/** Marca reutilizada en el acceso y en la navegación lateral. */
function Brand() {
  return <div className="brand"><span className="brand-mark">s</span> synco</div>;
}

/**
 * Dibuja el formulario y el panel visual de acceso.
 * @param {{ onLogin: () => void }} props Callback que App usa para abrir el dashboard.
 * El envío solo valida campos en el navegador; no comprueba credenciales.
 */
function Login({ onLogin }) {
  return (
    <main className="login-page">
      <section className="login-panel">
        <Brand />
        <form className="login-content" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
          <span className="eyebrow">Tu espacio de trabajo</span>
          <h1>Qué bueno tenerte de vuelta.</h1>
          <p>Entra para continuar con tus proyectos y tu equipo.</p>
          <label className="field">Correo electrónico<input type="email" placeholder="nombre@equipo.com" autoComplete="email" required /></label>
          <label className="field">Contraseña<input type="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" required /></label>
          <div className="login-options"><label className="remember"><input type="checkbox" /> Recordarme</label></div>
          <button type="submit" className="primary-button">Iniciar sesión</button>
        </form>
        <div className="login-foot">© 2026 Synco · Hecho para trabajar mejor en equipo</div>
      </section>
      <aside className="login-visual" aria-label="Espacio de trabajo compartido">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90" alt="Estudio luminoso preparado para trabajar en equipo" />
        <div className="visual-shade" />
        <div className="visual-copy"><span>Ideas que avanzan juntas</span><h2>Un lugar para que el buen trabajo suceda.</h2><p>Proyectos, personas y referencias, en sintonía.</p></div>
      </aside>
    </main>
  );
}

/**
 * Dibuja la navegación lateral y el perfil de ejemplo.
 * @param {{ view: string, setView: (view: string) => void, onLogout: () => void }} props
 * `view` debe coincidir con uno de los IDs declarados en `links` y usado por App.
 */
function Navigation({ view, setView, onLogout }) {
  const links = [{ id: "dashboard", symbol: "◫", label: "Dashboard" }, { id: "gallery", symbol: "▦", label: "Galería" }];
  return (
    <aside className="sidebar">
      <Brand />
      <div className="nav-label">Espacio de trabajo</div>
      <nav className="nav-list" aria-label="Navegación principal">
        {links.map((link) => <button key={link.id} className={`nav-item ${view === link.id ? "active" : ""}`} onClick={() => setView(link.id)} aria-current={view === link.id ? "page" : undefined}><span className="nav-symbol" aria-hidden="true">{link.symbol}</span>{link.label}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile"><div className="avatar">AS</div><div className="profile-copy"><strong>Alex Silva</strong><span>Equipo creativo</span></div></div>
        <button className="logout" onClick={onLogout}>← Cerrar sesión</button>
      </div>
    </aside>
  );
}

/**
 * Dibuja métricas y tarjetas de proyecto.
 * @param {{ goToGallery: () => void, projectList: Array }} props La lista llega desde App.
 * Para cambiar las métricas de ejemplo, edita los valores dentro del JSX de esta vista.
 */
function Dashboard({ goToGallery, projectList }) {
  return (
    <div className="view-content">
      <header className="welcome-row"><div><span className="eyebrow">Tu espacio de trabajo</span><h1>Buenos días, Alex</h1><p>Este es el pulso de tu espacio de trabajo.</p></div><span className="date-label">10 de noviembre, 2026</span></header>
      <section className="stats-grid" aria-label="Resumen del espacio">
        <article className="stat"><div className="stat-top"><span>Proyectos activos</span><span className="stat-tag">+2 este mes</span></div><strong>08</strong></article>
        <article className="stat"><div className="stat-top"><span>Tareas pendientes</span><span className="stat-tag">3 para hoy</span></div><strong>24</strong></article>
        <article className="stat"><div className="stat-top"><span>Personas en el equipo</span><span className="stat-tag">En línea</span></div><strong>12</strong></article>
        <article className="stat"><div className="stat-top"><span>Entregas esta semana</span><span className="stat-tag">A tiempo</span></div><strong>06</strong></article>
      </section>
      <div className="section-heading"><h2>Proyectos recientes</h2><button className="quiet-button" onClick={goToGallery}>Explorar galería →</button></div>
      <section className="project-grid" aria-label="Proyectos recientes">
        {projectList.map((project) => <article className="project-card" key={project.title}><img src={project.image} alt="" /><div className="project-info"><small>{project.kind}</small><h3>{project.title}</h3><div className="project-meta"><span>{project.people}</span><span className="project-status">{project.status}</span></div></div></article>)}
      </section>
    </div>
  );
}

/**
 * Dibuja la galería y filtra sus recursos por categoría en el estado local.
 * @param {{ onChoose: (title: string) => void }} props Callback que entrega a App el título elegido.
 * Si agregas una categoría, actualiza tanto `galleryItems` como `filters`.
 */
function Gallery({ onChoose }) {
  const [filter, setFilter] = useState("Todo");
  const filters = ["Todo", "Branding", "Diseño", "Contenido", "Inspiración"];
  const visibleItems = filter === "Todo" ? galleryItems : galleryItems.filter((item) => item.category === filter);
  return (
    <div className="view-content">
      <header className="gallery-heading"><div><span className="eyebrow">Punto de partida</span><h1>Galería de ideas</h1><p>Explora recursos para poner en marcha tu próximo proyecto.</p></div><button className="quiet-button" onClick={() => onChoose("Colección nueva")}>＋ Crear colección</button></header>
      <div className="gallery-tools" role="group" aria-label="Filtrar galería">{filters.map((item) => <button key={item} className={`filter-button ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div>
      <section className="gallery-grid" aria-label="Recursos de la galería">
        {visibleItems.length ? visibleItems.map((item) => <article className="gallery-card" key={item.title}><div className="gallery-image"><img src={item.image} alt="" loading="lazy" /><span className="gallery-category">{item.category}</span></div><div className="gallery-info"><h3>{item.title}</h3><p>{item.description}</p><div className="gallery-footer"><span>{item.time}</span><button onClick={() => onChoose(item.title)}>Usar recurso ↗</button></div></div></article>) : <div className="empty-state">No hay recursos en esta categoría todavía.</div>}
      </section>
    </div>
  );
}

/**
 * Componente raíz y controlador de la navegación entre las tres pantallas.
 * `view` controla la pantalla, `addedProjects` comparte selecciones con Dashboard
 * y `notice` muestra confirmaciones temporales.
 */
function App() {
  const [view, setView] = useState("login");
  const [notice, setNotice] = useState("");
  const [addedProjects, setAddedProjects] = useState([]);

  // Convierte la selección de Gallery en un proyecto y reemplaza duplicados por título.
  const chooseResource = (title) => {
    const resource = galleryItems.find((item) => item.title === title);
    const project = {
      title,
      kind: resource?.category ?? "Colección",
      image: resource?.image ?? galleryItems[0].image,
      people: "Solo tú",
      status: "Listo para empezar",
    };
    setAddedProjects((current) => [project, ...current.filter((item) => item.title !== title)]);
    setNotice(`${title} se agregó a tus proyectos.`);
    window.setTimeout(() => setNotice(""), 2800);
  };

  if (view === "login") return <Login onLogin={() => setView("dashboard")} />;

  return (
    <div className="workspace">
      <Navigation view={view} setView={setView} onLogout={() => setView("login")} />
      <main className="main-area">
        <header className="topbar"><span className="breadcrumb">Synco <span aria-hidden="true">/</span> {view === "dashboard" ? "Dashboard" : "Galería"}</span><div className="topbar-right"><span><i className="status-dot" />Todos los sistemas activos</span><div className="avatar">AS</div></div></header>
        {view === "dashboard" ? <Dashboard goToGallery={() => setView("gallery")} projectList={[...addedProjects, ...projects]} /> : <Gallery onChoose={chooseResource} />}
      </main>
      {notice && <div className="notice" role="status">{notice}</div>}
    </div>
  );
}

// Punto de montaje: el elemento #root se define en `index.html`.
createRoot(document.getElementById("root")).render(<App />);