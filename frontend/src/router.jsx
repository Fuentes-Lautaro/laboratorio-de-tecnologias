import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import Spinner from './shared/components/Spinner'
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import { SuscripcionesPage } from './features/suscripciones'
import { FlujoSuscripcionPage } from './features/suscripciones/pages/FlujoSuscripcionPage'



export const router = createBrowserRouter([
  // ---------- Vista pública: Navbar + <Outlet /> + Footer ----------
  {
    path: '/',
    element: <LayoutPublico />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> }, // "/" exacto
      { path: 'catalogo', element: <CatalogoPage /> }, // "/catalogo"
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
      { path: 'suscripciones', element: <SuscripcionesPage /> }, // "/suscripciones"
      { path: 'suscripciones/:nombre', element: <FlujoSuscripcionPage /> }, // "/suscripciones/:nombre"
    ],
  },

  // ---------- Vista privada: NavbarGestor + sidebar + <Outlet /> ----------
])
