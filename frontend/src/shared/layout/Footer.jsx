// CLASE 3 · Componentes puros: calcular la fecha dentro del render daría un
// resultado distinto en cada ejecución. Se calcula una vez, fuera del componente.

const ANIO_ACTUAL = new Date().getFullYear()

function Footer({ marca }) {
  return (
    <footer>
        <div className="footer-contenedor">

            <ul className="footer-links">
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Catalogo</a></li>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Contactanos</a></li>
            </ul>

            <hr className="linea-divisoria"></hr>

            <div className="container-fluid px-3 px-lg-5 text-center">
                <p className="mb-1 text-light">{marca}</p>
                <p className="mb-0 small text-light">&copy; {ANIO_ACTUAL} — Todos los derechos reservados</p>
            </div>  
        </div>
    </footer>
  )
}

export default Footer
