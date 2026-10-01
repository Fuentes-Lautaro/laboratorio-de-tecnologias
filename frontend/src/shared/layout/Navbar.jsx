import { Link, NavLink } from 'react-router-dom';

function Navbar({ enlaces, logoSrc, logoAlt = "Logo" }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark nav-personalizado py-0">
            <div className="container-fluid px-3 px-lg-5 flex-column">
                
                <div className="w-100 d-flex justify-content-between align-items-center py-1 border-bottom-brand">
                    <Link className="navbar-brand d-flex align-items-center m-0 logo-container" to="/">
                        <img src="/img/logos/logo-Maria-Balbina-Lateral-recortado.png" className="logo-img" />
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        <Link className="btn btn-ingresar" to="/login">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>

                {/* --- FILA INFERIOR: Enlaces (Fijos arriba al hacer scroll) --- */}
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