import { useNavigate, useRevalidator } from 'react-router-dom';
import FormularioLogin from '../components/FormularioLogin';
import { iniciarSesion } from '../services/authService.js';

export function LoginPage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const handleIngresar = async ({ email, password }) => {
    const sesion = await iniciarSesion(email, password);
    
    if (sesion) {
      revalidator.revalidate(); 
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-auto">
      <div style={{ maxWidth: '440px', width: '100%' }} className="px-3">
        
        {/* Tarjeta de Login */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-3" style={{ backgroundColor: '#ffffff' }}>
          <div className="py-3 px-3 text-center text-white" style={{ backgroundColor: 'var(--paneles)' }}>
            <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--fondos-principales, #Fff)' }}>
              Iniciar Sesion
            </h1>
          </div>

          <div className="p-3 p-md-4">
            <FormularioLogin onIngresar={handleIngresar} />
          </div>
        </div>

        {/* Usuarios de prueba */}
        <details className="mt-2 text-center">
          <summary 
            className="user-select-none small text-uppercase fw-semibold cursor-pointer" 
            style={{ color: 'var(--referencias, #513B2A)', fontSize: '0.75rem', letterSpacing: '1px', listStyle: 'none' }}
          >
            🔑 <span className="text-decoration-underline" style={{ textUnderlineOffset: '3px' }}>Ver usuarios de prueba</span>
          </summary>

          <div 
            className="rounded-3 p-3 mt-2 text-start shadow-sm" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(181, 134, 90, 0.25)', fontSize: '0.78rem' }}
          >
            <div className="d-flex flex-column gap-2">
              <div>
                <strong style={{ color: 'var(--titulos, #64141B)' }}>Suscripto:</strong> maria.balbina@balbina.com / 123456
              </div>
              <div>
                <strong style={{ color: 'var(--detalles, #B5865A)' }}>No suscripto:</strong> juan.perez@ejemplo.com / 123456
              </div>
            </div>
          </div>
        </details>

      </div>
    </div>
  );
}

export default LoginPage;