// CLASE 3 · Componentes puros: calcular la fecha dentro del render daría un
// resultado distinto en cada ejecución. Se calcula una vez, fuera del componente.

import { NavLink } from "react-router-dom"

const ANIO_ACTUAL = new Date().getFullYear()

function Footer({ marca, enlaces, srcfooter }) {
  return (
    <footer className="w-100 overflow-hidden">
      <div className="footer-contenedor container-fluid px-3 px-md-5 py-1">

        {/* Enlaces de navegación principales */}
        <div className="row justify-content-center text-center mb-0">
          <div className="col-12">
            <ul className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3 gap-lg-5 pb-1 footer-links list-unstyled mb-0">
              {enlaces.map((enlace) => (
                <li className="nav-item" key={enlace.id}>
                  <NavLink 
                    className="footer-link-custom text-decoration-none" 
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

        <hr className="linea-divisoria mx-auto w-100" />

        {/* Redes sociales */}
        <div className="row justify-content-center text-center mb-0">
          <div className="col-12">
            <ul className="footer-redes d-flex flex-wrap justify-content-center align-items-center gap-6 list-unstyled mb-0 p-0">
              {srcfooter.map((enlace) => (
                <li className="nav-item text-center" key={enlace.id}>
                  <a href={enlace.ruta} target="_blank" rel="noopener noreferrer" className="d-inline-block">
                    <img src={enlace.img} alt={enlace.id} style={{ maxWidth: '28px', height: 'auto' }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="linea-divisoria mx-auto w-100" />

        {/* Marca y Derechos Reservados */}
        <div className="row text-center">
          <div className="col-12 px-1">
            <p className="mb-1 text-light fw-semibold">{marca}</p>
            <p className="mb-0 small text-light">&copy; {ANIO_ACTUAL} — Todos los derechos reservados</p>
          </div>
        </div>  

      </div>
    </footer>
  )
}

export default Footer   