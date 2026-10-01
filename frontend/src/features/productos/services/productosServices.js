const URL_BASE = '/backend/data'

export async function getProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos')
  }
  return respuesta.json()
}

export async function getProductoPorId(id) {
  const productos = await getProductos()
  const producto = productos.find((p) => p.id === id)
  console.log('entro aca')
  if (!producto) {
    throw new Error('El producto que buscás no existe')
    console.log('no l encontro')
  }
  return producto
}