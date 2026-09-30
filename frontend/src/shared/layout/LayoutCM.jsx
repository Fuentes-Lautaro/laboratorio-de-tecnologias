import { Outlet, useLoaderData } from 'react-router-dom';
import { NavCM } from './NavCM';

export default function LayoutCM() {
  const sesion = useLoaderData();

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Menú de navegación adaptativo */}
      <NavCM sesion={sesion} />

      {/* Contenido principal de la página */}
      <main className="flex-grow-1 p-3 p-md-4 bg-light overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}