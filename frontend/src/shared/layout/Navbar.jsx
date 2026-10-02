import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useRevalidator } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth';
import { getSuscripcionActivaPorDni } from '../../features/suscripciones'; // Ajusta la ruta según la ubicación de tu servicio

function Navbar({ enlaces, sesion }) {
    const navigate = useNavigate();
    const [tieneSuscripcion, setTieneSuscripcion] = useState(false);
    const revalidator = useRevalidator();

    useEffect(() => {
        async function verificarSuscripcion() {
            if (sesion?.dni) {
                try {
                    const suscripcion = await getSuscripcionActivaPorDni(sesion.dni);
                    setTieneSuscripcion(Boolean(suscripcion));
                } catch (error) {
                    console.error('Error al verificar la suscripción:', error);
                    setTieneSuscripcion(false);
                }
            } else {
                setTieneSuscripcion(false);
            }
        }

        verificarSuscripcion();
    }, [sesion]);

    const handleCerrarSesion = () => {
        cerrarSesion();
        revalidator.revalidate();
        navigate('/', { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark nav-personalizado py-0">
            <div className="container-fluid px-3 px-lg-5 flex-column">
                
                <div className="w-100 d-flex justify-content-between align-items-center py-1 border-bottom-brand flex-wrap">
                    <Link className="navbar-brand d-flex align-items-center m-0 logo-container" to="/">
                        <img src="/img/logos/logo-Maria-Balbina-Lateral-recortado.png" className="logo-img" alt="Logo-Maria-Balbina" />
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        {sesion ? (
                            <div className="dropdown position-relative">
                                <button 
                                    className="btn btn-ingresar dropdown-toggle d-flex align-items-center gap-2" 
                                    type="button" 
                                    id="menuUsuario" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false"
                                    style={{ maxWidth: '200px' }}
                                >
                                    <span className="text-truncate">Hola, {sesion.nombre || 'Usuario'}</span>
                                </button>
                                
                                <ul className="dropdown-menu dropdown-menu-end shadow" style={{ position: 'absolute', zIndex: 1050 }} aria-labelledby="menuUsuario">
                                    <li>
                                        <Link className="dropdown-item" to="/perfil">
                                            ✏️ Modificar datos personales
                                        </Link>
                                    </li>

                                    {/* Se muestra solo si la función confirmó la suscripción activa */}
                                    {tieneSuscripcion && (
                                        <li>
                                            <Link className="dropdown-item" to="/mi-suscripcion">
                                                💳 Ver suscripción
                                            </Link>
                                        </li>
                                    )}

                                    <li><hr className="dropdown-divider" /></li>

                                    <li>
                                        <button 
                                            className="dropdown-item text-danger" 
                                            onClick={handleCerrarSesion}
                                        >
                                            🚪 Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-ingresar" to="/login">
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>

                <div className="w-100 navbar-sticky-bottom">
                    <div className="w-100 d-flex justify-content-end align-items-center py-1 d-lg-none">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#menuPrincipal"
                            aria-controls="menuPrincipal"
                            aria-expanded="false"
                            aria-label="Desplegar navegación"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

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