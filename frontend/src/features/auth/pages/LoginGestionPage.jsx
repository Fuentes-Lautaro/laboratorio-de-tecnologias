import { useNavigate, Link } from 'react-router-dom';
import FormularioLogin from '../components/FormularioLogin';
import { iniciarSesionEmpleado } from '../services/authService.js';

export function LoginGestionPage() {
  const navigate = useNavigate();

  const handleIngresar = async ({ email, password }) => {
    const sesion = await iniciarSesionEmpleado(email, password);

    const rol = sesion?.rol?.toLowerCase() || '';

    if (rol === 'cm') {
      navigate('/cm/eventos', { replace: true });
    } else if (['vendedor', 'gerente', 'empleado', 'gestor', 'administrador'].includes(rol)) {
      navigate('/gestion', { replace: true });
    } else {
      throw new Error('El usuario no posee permisos para acceder al área de gestión.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--fondos-principales)' }}>
      {/* 1. HEADER / NAV EXCLUSIVO DE GESTIÓN */}
      <header className="py-3 px-4 shadow-sm" style={{ backgroundColor: 'var(--paneles)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center max-width-1200">
          <div className="d-flex align-items-center gap-2">
            <span style={{ color: 'var(--detalles)', fontSize: '1.2rem' }}>✦</span>
            <span className="fw-bold tracking-wider text-white mb-0 fs-5" style={{ letterSpacing: '2px' }}>
              MARÍA BALBINA
            </span>
            <span className="badge ms-2" style={{ backgroundColor: 'var(--detalles)', color: 'var(--fondos-principales)' }}>
              Gestión
            </span>
          </div>

          <Link 
            to="/" 
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
            style={{ borderColor: 'var(--detalles, var(--detalles))', color: 'var(--fondos-principales, #fff)' }}
          >
            ← Ir a la Tienda
          </Link>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL / FORMULARIO */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
        <div style={{ maxWidth: '440px', width: '100%' }}>
          
         
          <div 
            className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4"
            style={{ backgroundColor: '#ffffff'}}
          >
            <div 
              className="py-4 px-3 text-center text-white"
              style={{ backgroundColor: 'var(--paneles)' }}
            >
              <h1 className="h4 fw-bold mb-1" style={{ color: 'var(--fondos-principales, #Fff)' }}>
                Acceso al Sistema
              </h1>
              <p className="small mb-0 opacity-75" style={{ color: 'var(--detalles, #B5865A)' }}>
                Ingrese sus credenciales de empleado
              </p>
            </div>

            <div className="p-4">
              <FormularioLogin onIngresar={handleIngresar} />
            </div>
          </div>

            {/* Desplegable de Credenciales */}
            <details className="mt-3 text-center">
            <summary 
                className="user-select-none small text-uppercase fw-semibold cursor-pointer"
                style={{ 
                color: 'var(--referencias, #513B2A)', 
                fontSize: '0.75rem', 
                letterSpacing: '1px',
                listStyle: 'none'
                }}
            >
                🔑 <span className="text-decoration-underline" style={{ textUnderlineOffset: '3px' }}>Ver usuarios de prueba</span>
            </summary>

            <div 
                className="rounded-3 p-3 mt-2 text-start"
                style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                border: '1px solid rgba(181, 134, 90, 0.25)',
                fontSize: '0.78rem'
                }}
            >
                <div className="d-flex flex-column gap-2">
                <div>
                    <strong style={{ color: 'var(--titulos, #64141B)' }}>Gerente:</strong> gestor@mariabalbina.com / gestor123
                </div>
                <div>
                    <strong style={{ color: 'var(--detalles, #B5865A)' }}>CM:</strong> cm@mariabalbina.com / cm123
                </div>
                <div>
                    <strong >Empleado:</strong> admin@mariabalbina.com / ventas123
                </div>
                </div>
            </div>
            </details>

        </div>
      </main>

      {/* 3. FOOTER MINIMALISTA DE SISTEMA */}
      <footer 
        className="py-3 text-center text-white-50 fs-7"
        style={{ 
          backgroundColor: 'var(--paneles, #3E100F)', 
          borderTop: '1px solid var(--detalles, #B5865A)' 
        }}
      >
        <div className="container">
          <p className="mb-0 small" style={{ color: 'var(--fondos-principales, #F9EBE0)' }}>
            © 2026 Vinoteca María Balbina. Área Restringida para Personal Autorizado.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LoginGestionPage;