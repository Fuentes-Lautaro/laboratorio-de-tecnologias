import { Outlet, useLoaderData } from 'react-router-dom';
import { NavGestor } from './NavGestor';

export default function LayoutAdministrador() {
  const sesion = useLoaderData(); // Obtiene la sesión validada desde el loader de React Router

  return (
    <div className="d-flex min-vh-100">
      <div style={{ width: '260px' }}>
        <NavGestor sesion={sesion} />
      </div>
      <main className="flex-grow-1 p-4 bg-light overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}