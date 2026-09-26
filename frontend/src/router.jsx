import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import Spinner from './shared/components/Spinner'
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import DetalleProductoPage from './features/catalogo/pages/DetalleProductoPage'

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
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
    ],
  },

  // ---------- Vista privada: NavbarGestor + sidebar + <Outlet /> ----------
])
