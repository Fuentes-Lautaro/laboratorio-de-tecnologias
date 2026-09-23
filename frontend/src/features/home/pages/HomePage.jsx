import { useOutletContext } from 'react-router'
import Spinner from '../../../shared/components/Spinner'
import Hero from '../componentes/Hero'
import Bienvenida from '../componentes/Bienvenida'
import PromocionPlanes from '../componentes/PromocionPlanes'
function HomePage() {

  return (
    <>
      <Hero />
      <Bienvenida />
      <PromocionPlanes />
    </>
  )
}

export default HomePage
