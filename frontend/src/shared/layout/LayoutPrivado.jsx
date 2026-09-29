import { NavLink, Outlet, ScrollRestoration, useLoaderData } from 'react-router'
import NavBarAdmin from './NavBarAdmin'

const ENLACES_GESTOR = [
  { id: 1, texto: 'Inicio', destino: '/gestor', disponible: true },
  { id: 2, texto: 'Productos', destino: '/gestor/productos', disponible: true },
  { id: 3, texto: 'Categorías', destino: '/gestor/categorias', disponible: true },
  { id: 4, texto: 'Pedidos', destino: '/gestor/pedidos', disponible: true },
]

function LayoutPrivado() {
  const usuario = useLoaderData()

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--fondos-principales)' }}>
      {/* Barra superior */}
      <NavBarAdmin usuario={usuario} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar vertical izquierdo fijo en PC */}
        <aside
          className="offcanvas-lg offcanvas-start sidebar-gestor border-end p-3 d-flex flex-column"
          tabIndex="-1"
          id="menuGestor"
          aria-labelledby="tituloMenuGestor"
        >
          <div className="offcanvas-header d-lg-none mb-3">
            <h2 className="offcanvas-title h6 text-light" id="tituloMenuGestor">
              Menú de Gestión
            </h2>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              data-bs-target="#menuGestor"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="offcanvas-body p-0 flex-grow-1">
            <nav className="nav nav-pills flex-column w-100 gap-2">
              {ENLACES_GESTOR.map((enlace) =>
                enlace.disponible ? (
                  <NavLink 
                    key={enlace.id} 
                    className="nav-link text-light px-3 py-2 rounded" 
                    to={enlace.destino} 
                    end
                  >
                    {enlace.texto}
                  </NavLink>
                ) : (
                  <span
                    key={enlace.id}
                    className="nav-link disabled text-muted d-flex justify-content-between align-items-center px-3 py-2"
                  >
                    {enlace.texto}
                    <small className="badge text-bg-secondary">Próximamente</small>
                  </span>
                ),
              )}
            </nav>
          </div>
        </aside>

        {/* Contenido dinámico de las páginas del gestor */}
        <main className="flex-grow-1 p-4">
          <Outlet context={{ usuario }} />
        </main>
      </div>

      <ScrollRestoration />
    </div>
  )
}

export default LayoutPrivado