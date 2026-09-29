import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import LayoutPrivado from './shared/layout/LayoutPrivado'
import Spinner from './shared/components/Spinner'
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import DetalleProductoPage from './features/catalogo/pages/DetalleProductoPage'
import AdminInicioPage from './features/adminPanel/pages/AdminInicioPage'
import { NosotrosPages } from './features/nosotros'
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
      { path: 'catalogo/:id', element: <DetalleProductoPage /> }, // "/catalogo"
      { path: '/nosotros', element: <NosotrosPages /> },
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
      { path: 'suscripciones', element: <SuscripcionesPage /> }, // "/suscripciones"
      { path: 'suscripciones/:nombre', element: <FlujoSuscripcionPage /> }, // "/suscripciones/:nombre"
    ],
  },

  // ---------- Vista privada: NavbarGestor + sidebar + <Outlet /> ----------
  {
    path: '/admin',
    element: <LayoutPrivado />,
    hydrateFallbackElement: <Spinner />,
    errorElement: <NoEncontradaPage />,
    children: [{index: true, element: <AdminInicioPage />}]
  },
])
