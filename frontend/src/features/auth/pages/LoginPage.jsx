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

      const rol = sesion.rol?.toLowerCase() || '';

      if (rol === 'cm') {
        navigate('/cm/eventos', { replace: true });
      } else if (['vendedor', 'gerente'].includes(rol)) {
        navigate('/gestion', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-auto">
      <div style={{ maxWidth: '440px', width: '100%' }} className="px-3">
        
        {/* Tarjeta de Login */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-3" style={{ backgroundColor: '#ffffff' }}>
          <div className="py-3 px-3 text-center text-white" style={{ backgroundColor: 'var(--paneles)' }}>
            <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--fondos-principales, #FFF)' }}>
              Iniciar Sesión
            </h1>
          </div>

          <div className="p-3 p-md-4">
            <FormularioLogin onIngresar={handleIngresar} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;