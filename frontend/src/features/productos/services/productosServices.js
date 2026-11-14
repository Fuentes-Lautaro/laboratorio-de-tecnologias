import { obtenerSesion, cerrarSesion } from '../../auth';

const URL_BASE = `${import.meta.env.VITE_API_URL}/api`;

async function procesarRespuesta(respuesta, mensajeError) {
  if (respuesta.status === 401 || respuesta.status === 403) {
    cerrarSesion();
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, volvé a iniciar sesión.');
  }

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    const error = new Error(err.error || err.mensaje || mensajeError);
    if (err.productoInactivo) {
      error.productoInactivo = err.productoInactivo;
    }
    throw error;
  }

  return respuesta.json();
}

export async function getProductos(filtros = {}) {
  const queryParams = new URLSearchParams();

  if (filtros && typeof filtros === 'object') {
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (Array.isArray(valor) && valor.length > 0) {
        queryParams.append(clave, valor.join(','));
      } else if (typeof valor === 'string' && valor.trim() !== '') {
        queryParams.append(clave, valor.trim());
      }
    });
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${URL_BASE}/productos?${queryString}` : `${URL_BASE}/productos`;

  const respuesta = await fetch(url);

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