import { useOutletContext } from 'react-router'
import Spinner from '../../../shared/components/Spinner'
import Hero from '../components/Hero'
import Bienvenida from '../components/Bienvenida'
import PromocionPlanes from '../components/PromocionPlanes'
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
