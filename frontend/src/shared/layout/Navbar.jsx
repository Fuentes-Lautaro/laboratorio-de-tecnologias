import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useRevalidator } from 'react-router-dom';
import { cerrarSesion } from '../../features/auth';
import { getSuscripcionActivaPorDni } from '../../features/suscripciones';
import { getPersonaPorId } from '../../features/personas/services/personasServices';

function Navbar({ enlaces, sesion }) {
    const navigate = useNavigate();
    const [tieneSuscripcion, setTieneSuscripcion] = useState(false);
    const [persona, setPersona] = useState(null);
    const revalidator = useRevalidator();

    // Verificación de roles con permiso de gestión
    const ROLES_GESTION = ['cm', 'vendedor', 'gerente'];
    const rolNormalizado = sesion?.rol?.toLowerCase() || '';
    const esPersonalGestion = Boolean(sesion && ROLES_GESTION.includes(rolNormalizado));
    const destinoGestion = rolNormalizado === 'cm' ? '/cm/eventos' : '/gestion';

    useEffect(() => {
        async function verificarDatosUsuario() {
            if (sesion) {
                try {
                    const data = await getPersonaPorId();
                    setPersona(data);
                } catch (error) {
                    console.error('Error al obtener datos del perfil:', error);
                    setPersona(null);
                }

                try {
                    const suscripcion = await getSuscripcionActivaPorDni(sesion.dni);
                    setTieneSuscripcion(Boolean(suscripcion));
                } catch (error) {
                    console.error('Error al verificar la suscripción:', error);
                    setTieneSuscripcion(false);
                }
            } else {
                setPersona(null);
                setTieneSuscripcion(false);
            }
        }

        verificarDatosUsuario();
    }, [sesion]);

    const handleCerrarSesion = () => {
        cerrarSesion();
        revalidator.revalidate();
        navigate('/', { replace: true });
    };

    const nombreUsuario = persona?.nombre;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark nav-personalizado py-0">
            <div className="container-fluid px-3 px-lg-5 flex-column">
                
                {/* 1. BARRA SUPERIOR (Logo limpio y en desktop los botones de usuario) */}
                <div className="w-100 d-flex justify-content-between align-items-center py-2 border-bottom-brand">
                    <Link className="navbar-brand d-flex align-items-center m-0 logo-container" to="/">
                        <img src="/img/logos/logo-Maria-Balbina-Lateral-recortado.png" className="logo-img" alt="Logo-Maria-Balbina" />
                    </Link>

                    {/* Botones en ESCRITORIO (Oculto en celulares) */}
                    <div className="d-none d-lg-flex align-items-center gap-2">
                        {esPersonalGestion && (
                            <Link to={destinoGestion} className="btn btn-outline-light btn-sm fw-semibold me-1">
                                Ir a gestión
                            </Link>
                        )}

                        {sesion ? (
                            <div className="dropdown position-relative">
                                <button 
                                    className="btn btn-ingresar dropdown-toggle d-flex align-items-center gap-2" 
                                    type="button" 
                                    id="menuUsuarioDesktop" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false"
                                    style={{ maxWidth: '220px' }}
                                >
                                    <span className="text-truncate">Hola, {nombreUsuario}</span>
                                </button>
                                
                                <ul className="dropdown-menu dropdown-menu-end shadow" style={{ position: 'absolute', zIndex: 1050 }} aria-labelledby="menuUsuarioDesktop">
                                    <li><Link className="dropdown-item" to="/perfil">Ver perfil</Link></li>
                                    <li><Link className="dropdown-item" to="/perfilPassword">Cambiar contraseña</Link></li>
                                    {tieneSuscripcion && (
                                        <li><Link className="dropdown-item" to="/mi-suscripcion">Ver suscripción</Link></li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger" onClick={handleCerrarSesion}>Cerrar sesión</button></li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-ingresar" to="/login">
                                Iniciar sesión
                            </Link>
                        )}
                    </div>

                    {/* Botón hamburguesa en CELULARES */}
                    <div className="d-flex align-items-center d-lg-none">
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
                </div>

                {/* 2. MENÚ DE NAVEGACIÓN Y CONTENIDO MÓVIL */}
                <div className="w-100 navbar-sticky-bottom">
                    <div className="collapse navbar-collapse justify-content-center" id="menuPrincipal">
                        {/* Se cambia align-lg-items-center por justify-content-lg-center para centrar los enlaces horizontalmente en desktop */}
                        <ul className="navbar-nav justify-content-lg-center align-items-center gap-lg-4 py-3 py-lg-2 text-center w-100">
                            
                            {/* Enlaces normales del Navbar */}
                            {enlaces.map((enlace) => (
                                <li className="nav-item" key={enlace.id}>
                                    <NavLink 
                                        className="nav-link nav-link-custom" 
                                        to={enlace.destino} 
                                        end={enlace.destino === '/'}
                                    >
                                        {enlace.texto}
                                    </NavLink>
                                </li>
                            ))}

                            {/* EN CELULARES: Opciones de usuario debajo de todo el panel hamburguesa */}
                            <div className="d-lg-none pt-3 mt-2 border-top border-secondary w-100 d-flex flex-column align-items-center gap-2">
                                {esPersonalGestion && (
                                    <div className="w-100 d-flex justify-content-center mb-1">
                                        <Link 
                                            to={destinoGestion} 
                                            className="btn btn-outline-light btn-sm fw-semibold rounded-pill py-1 px-4"
                                            style={{ width: '210px' }}
                                        >
                                            Ir a gestión
                                        </Link>
                                    </div>
                                )}

                                {sesion ? (
                                    <div className="w-100 d-flex flex-column align-items-center gap-2">
                                        <span className="text-white fw-semibold mb-1 small">Hola, {nombreUsuario}</span>
                                        
                                        <Link 
                                            className="btn btn-light btn-sm text-dark fw-semibold rounded-pill py-1 px-4 shadow-sm text-decoration-none" 
                                            style={{ width: '210px' }}
                                            to="/perfil"
                                        >
                                            Ver perfil
                                        </Link>
                                        <Link 
                                            className="btn btn-light btn-sm text-dark fw-semibold rounded-pill py-1 px-4 shadow-sm text-decoration-none" 
                                            style={{ width: '210px' }}
                                            to="/perfilPassword"
                                        >
                                            Cambiar contraseña
                                        </Link>

                                        {tieneSuscripcion && (
                                            <Link 
                                                className="btn btn-light btn-sm text-dark fw-semibold rounded-pill py-1 px-4 shadow-sm text-decoration-none" 
                                                style={{ width: '210px' }}
                                                to="/mi-suscripcion"
                                            >
                                                Ver suscripción
                                            </Link>
                                        )}

                                        <button 
                                            className="btn btn-sm rounded-pill py-1 px-4 fw-semibold mt-1 shadow-sm" 
                                            style={{ backgroundColor: 'var(--detalles)', color: 'var(--titulos)', width: '210px' }}
                                            onClick={handleCerrarSesion}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-100 d-flex justify-content-center">
                                        <Link 
                                            className="btn btn-ingresar btn-sm rounded-pill py-1 px-4" 
                                            style={{ width: '210px' }}
                                            to="/login"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    </div>
                                )}
                            </div>

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;