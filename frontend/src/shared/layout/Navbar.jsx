import { Link, NavLink, useNavigate, useRevalidator } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth';

function Navbar({ enlaces, sesion }) {
    const navigate = useNavigate();
    const revalidator = useRevalidator(); // 1. Importamos el revalidator

    const handleCerrarSesion = () => {
        cerrarSesion(); // Limpia la sesión (ej. localStorage)
        
        // 2. Forzamos la revalidación de los loaders para que LayoutPublico detecte el cambio
        revalidator.revalidate(); 

        navigate('/', { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark nav-personalizado py-0">
            <div className="container-fluid px-3 px-lg-5 flex-column">
                
                <div className="w-100 d-flex justify-content-between align-items-center py-1 border-bottom-brand">
                    <Link className="navbar-brand d-flex align-items-center m-0 logo-container" to="/">
                        <img src="/img/logos/logo-Maria-Balbina-Lateral-recortado.png" className="logo-img" alt="Logo-Maria-Balbina" />
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        {sesion ? (
                            <button onClick={handleCerrarSesion} className="btn btn-ingresar">
                                Cerrar sesión
                            </button>
                        ) : (
                            <Link className="btn btn-ingresar" to="/login">
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>

                {/* Resto de tu barra de navegación (enlaces) */}
                <div className="w-100 navbar-sticky-bottom">
                    <div className="collapse navbar-collapse justify-content-center" id="menuPrincipal">
                        <ul className="navbar-nav align-lg-items-center gap-lg-4 py-2 py-lg-0">
                            {enlaces.map((enlace) => (
                                <li className="nav-item text-center text-lg-start" key={enlace.id}>
                                    <NavLink 
                                        className="nav-link nav-link-custom" 
                                        to={enlace.destino} 
                                        end={enlace.destino === '/'}
                                    >
                                        {enlace.texto}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;