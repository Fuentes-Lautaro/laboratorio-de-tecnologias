import { createBrowserRouter } from 'react-router'
import Spinner from './shared/components/Spinner'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import { LoginGestionPage, protegerRuta, redirigirSiHaySesion } from './features/auth';
import LayoutPublico from './shared/layout/LayoutPublico'
import LayoutAdministrador from './shared/layout/LayoutAdministrador';
import LayoutCM from './shared/layout/LayoutCM';
import { HomePage } from './features/home'
import { CatalogoPage } from './features/catalogo'
import { DetalleProductoPage } from './features/catalogo'
import { NosotrosPage } from './features/nosotros'
import { SuscripcionesPage } from './features/suscripciones'
import { FlujoSuscripcionPage } from './features/suscripciones'
import { ContactoPage } from './features/contacto';
import { EventosPage } from './features/eventos';
import { ClientesPagePrivada } from './features/clientes';
import { ProductosPagePrivada } from './features/productos'
import { EventosPagePrivada } from './features/eventos';
import { PlanesPagePrivada } from './features/suscripciones';
import { EmpleadosPagePrivada } from './features/empleados'
import { SuscripcionesPagePrivada } from './features/suscripciones'
import { VentasPage } from './features/ventas'
import { EstadisticasPage } from './features/estadisticas'



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
      { path: 'nosotros', element: <NosotrosPage /> },
      { path: 'contacto', element: <ContactoPage /> },
      { path: 'suscripciones', element: <SuscripcionesPage /> }, // "/suscripciones"
      { path: 'suscripciones/:nombre', element: <FlujoSuscripcionPage /> }, // "/suscripciones/:nombre"
      { path: 'eventos', element: <EventosPage /> }, // "/eventos"
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
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
      { path: '', element: <EstadisticasPage /> },
      { path: 'clientes', element: <ClientesPagePrivada /> },
      { path: 'productos', element: <ProductosPagePrivada /> },
      { path: 'suscripciones', element: <SuscripcionesPagePrivada /> },
      { path: 'empleados', element: <EmpleadosPagePrivada /> },
      { path: 'planes', element: <PlanesPagePrivada /> },
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
