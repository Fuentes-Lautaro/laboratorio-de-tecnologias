const URL_BASE = '/backend/data'

export async function obtenerProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos')
  }
  return respuesta.json()
}

export async function obtenerProductoPorId(id) {
  const productos = await obtenerProductos()
  const producto = productos.find((p) => p.id === id)
  if (!producto) {
    throw new Error('El producto que buscás no existe')
  }
  return producto
}