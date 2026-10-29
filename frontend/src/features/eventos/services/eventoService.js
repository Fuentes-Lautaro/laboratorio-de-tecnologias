import { obtenerSesion } from '../../auth';

const BASE_URL = 'http://localhost:3000/api';

// --- RUTAS PÚBLICAS ---

export async function getEventos() {
  const res = await fetch(`${BASE_URL}/eventos`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al cargar la lista de eventos');
  }
  return await res.json();
}

export async function getEventoPorId(id) {
  const res = await fetch(`${BASE_URL}/eventos/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al obtener el evento');
  }
  return await res.json();
}

// --- RUTAS PROTEGIDAS (Requieren Token Bearer) ---

export async function crearEvento(datosEvento) {
  const sesion = obtenerSesion();

  const res = await fetch(`${BASE_URL}/eventos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(datosEvento)
  });

  if (res.status === 401 || res.status === 403) {
    sessionStorage.removeItem('vinoteca:sesion');
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al crear el evento');
  }

  return await res.json();
}

export async function actualizarEvento(id, datosEvento) {
  const sesion = obtenerSesion();

  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(datosEvento)
  });

  if (res.status === 401 || res.status === 403) {
    sessionStorage.removeItem('vinoteca:sesion');
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al actualizar el evento');
  }

  return await res.json();
}

export async function eliminarEvento(id) {
  const sesion = obtenerSesion();

  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al eliminar el evento');
  }

  if (res.status === 204) {
    return { ok: true };
  }

  return await res.json().catch(() => ({ ok: true }));
}