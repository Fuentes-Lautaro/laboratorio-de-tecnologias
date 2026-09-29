import { Link, NavLink, useNavigate } from 'react-router'
import Boton from '../components/Boton'
import { cerrarSesion } from '../../features/auth'

function NavBarAdmin({ usuario }) {
  const navigate = useNavigate()

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar-gestor d-flex flex-column justify-content-between p-3">
      <div>
        <div className="mb-4 px-2">
          <Link className="navbar-brand fs-5 fw-bold text-decoration-none text-light" to="/gestor">
            Indumentaria Sur <span className="badge badge-gestor ms-1">Gestor</span>
          </Link>
        </div>

        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink className="nav-link text-light px-3 py-2 rounded" to="/gestor" end>
              <i className="bi bi-house-door me-2"></i> Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-light px-3 py-2 rounded" to="/gestor/productos">
              <i className="bi bi-box-seam me-2"></i> Productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-light px-3 py-2 rounded" to="/gestor/categorias">
              <i className="bi bi-tags me-2"></i> Categorías
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-light px-3 py-2 rounded" to="/gestor/pedidos">
              <i className="bi bi-cart-check me-2"></i> Pedidos
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="pt-3 border-top border-secondary-subtle d-flex flex-column gap-2">
        <div className="px-2 mb-1">
          <span className="text-muted small d-block">Conectado como:</span>
          <span className="text-light fw-medium small text-truncate d-block">{usuario?.nombre}</span>
        </div>
        
        <Link to="/" className="btn btn-sm btn-outline-secondary text-light w-100">
          Ver tienda
        </Link>
        
        <Boton variante="warning" tamanio="sm" onClick={handleCerrarSesion} className="w-100">
          Cerrar sesión
        </Boton>
      </div>
    </aside>
  )
}

export default NavBarAdmin