const URL_BASE = 'http://localhost:3000/api'

export async function getProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos')
  }
  return respuesta.json()
}

export async function getProductoPorId(id) {
  const productos = await getProductos()
  const producto = productos.find((p) => p.id === id)
  if (!producto) {
    throw new Error('El producto que buscás no existe')
  }
  return producto
}