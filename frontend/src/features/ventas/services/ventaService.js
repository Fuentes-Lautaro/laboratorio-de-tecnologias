import { obtenerSesion, cerrarSesion } from '../../auth'; 

const URL_BASE = 'http://localhost:3000/api';

async function procesarRespuesta(respuesta, mensajeError) {
  // Si el token venció o no está autorizado, expulsa la sesión y manda a /login
  if (respuesta.status === 401 || respuesta.status === 403) {
    cerrarSesion();
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, volvé a iniciar sesión.');
  }

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || mensajeError);
  }

  return respuesta.json();
}



export async function getVentas() {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/ventas`, {
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  return procesarRespuesta(respuesta, 'No se pudieron obtener las ventas');
}

export async function getVentaPorId(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/ventas/${id}`, {
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  return procesarRespuesta(respuesta, 'La venta que buscás no existe');
}

export async function crearVenta(nuevaVenta) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/ventas`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(nuevaVenta)
  });

  return procesarRespuesta(respuesta, 'Error al registrar la venta');
}