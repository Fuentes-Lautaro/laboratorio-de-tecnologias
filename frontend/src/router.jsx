import { createBrowserRouter } from 'react-router'
import Spinner from './shared/components/Spinner'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
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
import { LoginPage, LoginGestionPage, protegerRuta, redirigirSiHaySesion, redirigirSiHaySesionPrivado, obtenerSesion } from './features/auth';
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
    loader: obtenerSesion,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage />, loader: redirigirSiHaySesion},
      { path: 'catalogo', element: <CatalogoPage /> },
      { path: 'catalogo/:id', element: <DetalleProductoPage /> },
      { path: 'nosotros', element: <NosotrosPage /> },
      { path: 'contacto', element: <ContactoPage /> },
      { path: 'suscripciones', element: <SuscripcionesPage /> },
      { path: 'suscripciones/:nombre', element: <FlujoSuscripcionPage /> },
      { path: 'eventos', element: <EventosPage /> },
      { path: '*', element: <NoEncontradaPage /> },
    ],
  },
  {
    path: 'login-gestion',
    element: <LoginGestionPage />,
    loader: redirigirSiHaySesionPrivado, // Si ya hay sesión iniciada, evita volver a mostrar el formulario
  },

  // Panel Interno de Administración (Vendedor / Gerente)
  {
    path: '/gestion',
    element: <LayoutAdministrador />,
    loader: protegerRuta,
    children: [
      { index: true, element: <EstadisticasPage /> },
      { path: 'ventas', element: <VentasPage /> },
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
