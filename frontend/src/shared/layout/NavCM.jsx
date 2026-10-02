import { NavLink, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth/services/authService.js';

export function NavCM({ sesion }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login-gestion', { replace: true });
  };

  // Estilo minimalista neutro (sin fondos pesados)
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
      className="d-flex flex-column p-3 p-md-4 sidebar-cm"
      style={{ 
        backgroundColor: '#1C1614', 
        borderRight: '1px solid rgba(255, 255, 255, 0.08)' 
      }}
    >
      {/* Encabezado: Panel + Usuario */}
      <div className="pb-3 mb-3 mb-md-4 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <h5 className="fw-bold text-white mb-1" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
          Panel CM
        </h5>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          {sesion?.nombre || 'Usuario CM'} <span style={{ color: 'var(--detalles, #B5865A)' }}>({sesion?.rol || 'CM'})</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="nav nav-pills flex-column gap-1 mb-3 mb-md-auto">
        <NavLink 
          to="/cm/eventos" 
          style={getNavLinkStyle} 
          className="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-1"
        >
          <span style={{ fontSize: '1.1rem' }}>📅</span>
          <span>Gestión Eventos</span>
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

      {/* Media query para adaptar ancho según el dispositivo */}
      <style>{`
        .sidebar-cm {
          width: 100%;
        }
        @media (min-width: 768px) {
          .sidebar-cm {
            width: 260px !important;
            min-width: 260px;
            min-height: 100vh;
            position: sticky; /* Mantiene el contenedor fijo */
          }
        }
      `}</style>
    </aside>
  );
}

export default NavCM;