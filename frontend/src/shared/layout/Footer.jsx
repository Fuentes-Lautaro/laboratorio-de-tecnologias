// CLASE 3 · Componentes puros: calcular la fecha dentro del render daría un
// resultado distinto en cada ejecución. Se calcula una vez, fuera del componente.

import { NavLink } from "react-router-dom"

const ANIO_ACTUAL = new Date().getFullYear()

function Footer({ marca, enlaces ,srcfooter }) {
  return (
    <footer>
        <div className="footer-contenedor">

            <div className="justify-content-center">
                <ul className="align-lg-items-center gap-5 pb-1 footer-links">
                    {enlaces.map((enlace) => (
                    <li className="nav-item" key={enlace.id}>
                        <NavLink 
                            className="footer-link-custom" 
                            to={enlace.destino} 
                            end={enlace.destino === '/'}
                        >
                            {enlace.texto}
                        </NavLink>
                    </li>
                    ))}
                </ul>
            </div>

            <hr className="linea-divisoria"></hr>

            <ul className="footer-redes">
                {srcfooter.map((enlace) => (
                    <li className="nav-item text-center text-lg-start" key={enlace.id}>
                        <a href={enlace.ruta} target="_blank">
                            <img src={enlace.img} alt={enlace.id}/>
                        </a>
                    </li>
                )
                )}
            </ul>

            <hr className="linea-divisoria"></hr>

            <div className="container-fluid px-1 px-lg-5 text-center">
                <p className="mb-0 text-light">{marca}</p>
                <p className="mb-0 small text-light">&copy; {ANIO_ACTUAL} — Todos los derechos reservados</p>
            </div>  
        </div>
    </footer>
  )
}

export default Footer
