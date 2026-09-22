import Navbar from './Navbar'
import Footer from './Footer'

const MARCA = 'MARIA BALBINA'

const ENLACES = [
  { id: 1, texto: 'Inicio', destino: '/' },
  { id: 2, texto: 'Catálogo', destino: '/catalogo' },
  { id: 3, texto: 'Contacto', destino: '/contacto' },
]

function LayoutPublico(){
    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar marca={MARCA} enlaces={ENLACES} />

            <Footer marca={MARCA} />
        </div>
    )
}

export default LayoutPublico