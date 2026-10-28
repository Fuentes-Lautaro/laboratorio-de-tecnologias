import { NavLink, useNavigate, Link } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth/services/authService';

export function NavGestor({ sesion }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  const getNavLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
    color: isActive ? 'var(--detalles)' : 'rgba(255, 255, 255, 0.65)',
    borderLeft: isActive ? '3px solid var(--detalles, #B5865A)' : '3px solid transparent',
    fontSize: '0.95rem',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.15s ease'
  });

  const rolUsuario = sesion?.rol?.toLowerCase() || '';
  const esGerente = rolUsuario === 'gerente';

  return (
    <aside 
      className="d-flex flex-column p-3 p-md-4 sidebar-gestor"
      style={{ 
        backgroundColor: '#3E100F',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Encabezado */}
      <div className="pb-3 mb-3 mb-md-4 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <h5 className="fw-bold text-white mb-1" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
          Panel Gestión
        </h5>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          {sesion?.nombre || 'Usuario'} <span style={{ color: 'var(--detalles, #B5865A)' }}>({sesion?.rol || 'rol'})</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="nav nav-pills flex-column gap-1 mb-3 mb-md-auto">

        <NavLink to="/gestion" end style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span>Estadísticas</span>
        </NavLink>

        <NavLink to="/gestion/ventas" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/gestion/clientes" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span>Clientes</span>
        </NavLink>

        <NavLink to="/gestion/productos" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span>Productos</span>
        </NavLink>

        <NavLink to="/gestion/suscripciones" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span>Suscripciones</span>
        </NavLink>
        
        {/* Sección de Administración */}
        {esGerente && (
          <>
            <div 
              className="mt-3 mt-md-4 mb-2 px-3 fw-semibold text-uppercase" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.4)', 
                fontSize: '0.78rem', 
                letterSpacing: '1.5px'
              }}
            >
              Administración
            </div>

            <NavLink to="/gestion/empleados" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
              <span>Empleados</span>
            </NavLink>

            <NavLink to="/gestion/planes" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
              <span>Planes</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Pie con Accesos Directos y Cerrar Sesión */}
      <div className="pt-3 mt-auto border-top d-flex flex-column gap-2" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        
        {/* Botón Ir a la Tienda */}
        <Link
          to="/"
          className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2 text-decoration-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--detalles, #B5865A)';
            e.currentTarget.style.borderColor = 'var(--detalles, #B5865A)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <span>Ir a la Tienda</span>
        </Link>

        {/* Botón Cerrar Sesión */}
        <button
          onClick={handleCerrarSesion}
          className="btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 rounded-2"
          style={{
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.9rem',
            fontWeight: '400',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
          }}
        >
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-gestor {
            width: 260px !important;
            min-width: 260px;
            height: 100vh;
            position: sticky;
            top: 0;
          }
        }
      `}</style>
    </aside>
  );
}

export default NavGestor;