import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import Spinner from './shared/components/Spinner'
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
<<<<<<< HEAD
import { SuscripcionesPage } from './features/suscripciones'
import { FlujoSuscripcionPage } from './features/suscripciones/pages/FlujoSuscripcionPage'


=======
import DetalleProductoPage from './features/catalogo/pages/DetalleProductoPage'
import { NosotrosPages } from './features/nosotros'
>>>>>>> 9186bb26110b40bf33a3acf7b855205038579b8d

export const router = createBrowserRouter([
  // ---------- Vista pública: Navbar + <Outlet /> + Footer ----------
  {
    path: '/',
    element: <LayoutPublico />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> }, // "/" exacto
      { path: 'catalogo', element: <CatalogoPage /> }, // "/catalogo"
      { path: 'catalogo/:id', element: <DetalleProductoPage /> }, // "/catalogo"
      { path: '/nosotros', element: <NosotrosPages /> },
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
      { path: 'suscripciones', element: <SuscripcionesPage /> }, // "/suscripciones"
      { path: 'suscripciones/:nombre', element: <FlujoSuscripcionPage /> }, // "/suscripciones/:nombre"
    ],
  },

  // ---------- Vista privada: NavbarGestor + sidebar + <Outlet /> ----------
])
