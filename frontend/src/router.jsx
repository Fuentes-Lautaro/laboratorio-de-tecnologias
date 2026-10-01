import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import Spinner from './shared/components/Spinner'
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import DetalleProductoPage from './features/catalogo/pages/DetalleProductoPage'
import { NosotrosPages } from './features/nosotros'
import { SuscripcionesPage } from './features/suscripciones'
import { FlujoSuscripcionPage } from './features/suscripciones/pages/FlujoSuscripcionPage'
import LayoutAdministrador from './shared/layout/LayoutAdministrador';
import LayoutCM from './shared/layout/LayoutCM';
import { LoginGestionPage, protegerRuta, redirigirSiHaySesion } from './features/auth';
import { EventosPagePrivada } from './features/eventos/pages/EventosPagePrivada';
import { EventosPage } from './features/eventos/pages/EventosPage';
import ProductosPagePrivada from './features/productos'



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
      { path: 'eventos', element: <EventosPage /> }, // "/eventos"
    ],
  },
  {
        path: 'login-gestion',
        element: <LoginGestionPage />,
        loader: redirigirSiHaySesion, // Si ya hay sesión iniciada, evita volver a mostrar el formulario[cite: 4]
      },

  // Panel Interno de Administración (Vendedor / Gerente)
  {
    path: '/gestion',
    element: <LayoutAdministrador />,
    loader: protegerRuta,
    children: [
      { path: 'ventas', element: <h2>Sección Ventas</h2> },
      { path: 'clientes', element: <h2>Sección Clientes</h2> },
      { path: 'productos', element: <ProductosPagePrivada /> },
      { path: 'compras', element: <h2>Sección Compras</h2> },
      { path: 'empleados', element: <h2>Sección Empleados (Solo Gerente)</h2> },
      { path: 'planes', element: <h2>Sección Planes (Solo Gerente)</h2> },
    ],
  },

  // Panel Community Manager
  {
    path: '/cm',
    element: <LayoutCM />,
    loader: protegerRuta,
    children: [
      { path: 'eventos', element: <EventosPagePrivada /> },
    ],
  },
]);
