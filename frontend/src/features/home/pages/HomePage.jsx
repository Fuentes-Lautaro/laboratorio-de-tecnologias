import Hero from '../components/Hero'
import Bienvenida from '../components/Bienvenida'
import PromocionPlanes from '../components/PromocionPlanes'
import { SuscripcionesPage } from '../../suscripciones/pages/SuscripcionesPage'
function HomePage() {

  return (
    <>
      <Hero />
      <SuscripcionesPage className="fondo-suscripciones-home" />
      <Bienvenida />
      
    </>
  )
}

export default HomePage
