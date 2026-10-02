import { Outlet, useLoaderData } from 'react-router-dom';
import { NavGestor } from './NavGestor';

export default function LayoutAdministrador() {
  const sesion = useLoaderData(); // Obtiene la sesión validada desde el loader de React Router

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Navegación responsiva */}
      <NavGestor sesion={sesion} />

      {/* Contenido principal */}
      <main className="flex-grow-1 p-3 p-md-4 bg-light overflow-auto">
        <Outlet context={{ usuario: sesion?.usuario || sesion }} />
      </main>
    </div>
  );
}