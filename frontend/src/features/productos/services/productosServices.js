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

export async function getProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos`);

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos');
  }

  return respuesta.json();
}

export async function getProductoPorId(id) {
  const respuesta = await fetch(`${URL_BASE}/productos/${id}`);

  if (!respuesta.ok) {
    throw new Error('El producto que buscás no existe');
  }

  return respuesta.json();
}

// --- SERVICIOS ---

export async function crearProducto(datosProducto) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/productos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(datosProducto)
  });

  return procesarRespuesta(respuesta, 'Error al crear el producto');
}

export async function actualizarProducto(id, datosProducto) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(datosProducto)
  });

  return procesarRespuesta(respuesta, 'Error al actualizar el producto');
}

export async function alternarEstadoProducto(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/productos/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  return procesarRespuesta(respuesta, 'Error al cambiar el estado del producto');
}