import { Outlet, useLoaderData } from 'react-router-dom';
import { NavCM } from './NavCM';

export default function LayoutCM() {
  const sesion = useLoaderData();

  return (
    <div className="d-flex min-vh-100">
      <div style={{ width: '260px' }}>
        <NavCM sesion={sesion} />
      </div>
      <main className="flex-grow-1 p-4 bg-light overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}