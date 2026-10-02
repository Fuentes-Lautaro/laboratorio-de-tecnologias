import { Outlet, ScrollRestoration, useLoaderData } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'

const MARCA = 'Maria Balbina'

const ENLACES = [
  { id: 1, texto: 'Inicio', destino: '/' },
  { id: 2, texto: 'Catálogo', destino: '/catalogo' },
  { id: 3, texto: 'Contacto', destino: '/contacto' },
  { id: 4, texto: 'Nosotros', destino: '/nosotros' },
  { id: 5, texto: 'Suscripciones', destino: '/suscripciones' },
  { id: 6, texto: 'Eventos', destino: '/eventos' },
]

const SRCFOOTER =[
    { id: 'instagram', ruta: 'https://www.instagram.com/', img:'/img/redes/logo-instagram.png'},
    { id: 'tiktok', ruta: 'https://www.tiktok.com/', img:'/img/redes/logo-tiktok.png'},
    { id: 'whatsapp', ruta: 'https://wa.me/qr/H7FKDEGC7A7YD1', img:'/img/redes/logo-whatsapp.png'},
]

function LayoutPublico(){
    const sesion = useLoaderData();

    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar enlaces={ ENLACES } sesion = {sesion} />

            <main className="container-fluid bg-light px-3 px-lg-5 flex-grow-1">
                <Outlet context />
            </main>

            <Footer marca={MARCA} enlaces={ENLACES} srcfooter={SRCFOOTER}/>

            <ScrollRestoration />
        </div>
    )
}

export default LayoutPublico