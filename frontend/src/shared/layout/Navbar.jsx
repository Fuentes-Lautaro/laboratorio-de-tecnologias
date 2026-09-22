import { Link, NavLink } from 'react-router-dom';

function Navbar({marca, enlaces}){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark nav-personalizado sticky-top">
            <div className="container-fluid px-3 px-lg-5">
                <Link className="navbar-brand d-flex align-items-center gap-2 nav-marca" to="/">
                    {marca}
                </Link>

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

                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        {enlaces.map((enlace) => (
                        <li className="nav-item" key={enlace.id}>
                            <NavLink className="nav-link nav-link-custom" to={enlace.destino} end={enlace.destino === '/'}>
                            {enlace.texto}
                            </NavLink>
                        </li>
                    ))}

                    <li className="nav-item">
                        <Link className="btn btn-ingresar ms-lg-3 mt-2 mt-lg-0" to="/login">
                            Ingresar
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    )
}

export default Navbar