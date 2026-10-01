import { NavLink, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth/services/authService';

export function NavGestor({ sesion }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login-gestion', { replace: true });
  };

  const getNavLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
    color: isActive ? 'var(--detalles)' : 'rgba(255, 255, 255, 0.65)',
    borderLeft: isActive ? '3px solid var(--detalles, #B5865A)' : '3px solid transparent',
    fontSize: '0.95rem',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.15s ease'
  });

  return (
    <aside 
      className="d-flex flex-column p-3 p-md-4 sidebar-gestor"
      style={{ 
        backgroundColor: '#1C1614',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Encabezado: Panel + Usuario */}
      <div className="pb-3 mb-3 mb-md-4 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <h5 className="fw-bold text-white mb-1" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
          Panel Gestión
        </h5>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          {sesion?.nombre || 'Sofía Martínez'} <span style={{ color: 'var(--detalles, #B5865A)' }}>({sesion?.rol || 'gerente'})</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="nav nav-pills flex-column gap-1 mb-3 mb-md-auto">
        <NavLink to="/gestion/ventas" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span style={{ fontSize: '1.1rem' }}>🛒</span>
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/gestion/clientes" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span>Clientes</span>
        </NavLink>

        <NavLink to="/gestion/productos" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span style={{ fontSize: '1.1rem' }}>📦</span>
          <span>Productos</span>
        </NavLink>

        <NavLink to="/gestion/compras" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span style={{ fontSize: '1.1rem' }}>🛍️</span>
          <span>Compras</span>
        </NavLink>

        {/* Separador de Sección */}
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
          <span style={{ fontSize: '1.1rem' }}>👔</span>
          <span>Empleados</span>
        </NavLink>

        <NavLink to="/gestion/planes" style={getNavLinkStyle} className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1">
          <span style={{ fontSize: '1.1rem' }}>📋</span>
          <span>Planes</span>
        </NavLink>
      </nav>

      {/* Pie con Botón de Cerrar Sesión */}
      <div className="pt-3 mt-auto border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
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
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Media query para responsive en mobile y escritorio */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-gestor {
            width: 260px !important;
            min-width: 260px;
            height: 100vh; /* Forzamos el alto exacto de la pantalla */
            position: sticky; /* Mantiene el contenedor fijo */
            top: 0; /* Lo ancla al borde superior */
          }
        }
      `}</style>
    </aside>
  );
}

export default NavGestor;