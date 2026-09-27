import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'

const MARCA = 'MARIA BALBINA'

const ENLACES = [
  { id: 1, texto: 'Inicio', destino: '/' },
  { id: 2, texto: 'Catálogo', destino: '/catalogo' },
  { id: 3, texto: 'Contacto', destino: '/contacto' },
{ id: 4, texto: 'Suscripciones', destino: '/suscripciones' },
]

function LayoutPublico(){
    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar marca={MARCA} enlaces={ENLACES} />

            <main className="container-fluid px-3 px-lg-5 py-4 flex-grow-1">
                <Outlet context />
            </main>

            <Footer marca={MARCA} />
        </div>
    )
}

export default LayoutPublico