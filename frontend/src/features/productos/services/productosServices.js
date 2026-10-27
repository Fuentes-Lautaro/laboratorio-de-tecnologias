const URL_BASE = 'http://localhost:3000/api';

export async function getProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos`);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos');
  }
  return respuesta.json();
}

export async function crearProducto(datosProducto) {
  const respuesta = await fetch(`${URL_BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosProducto)
  });

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al crear el producto');
  }

  return respuesta.json();
}

export async function actualizarProducto(id, datosProducto) {
  const respuesta = await fetch(`${URL_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosProducto)
  });

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al actualizar el producto');
  }

  return respuesta.json();
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_BASE}/productos/${id}`, {
    method: 'DELETE'
  });

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || 'Error al eliminar el producto');
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