const URL_BASE = '/backend/data'

export async function obtenerProductos() {
  const respuesta = await fetch(`${URL_BASE}/productos.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos')
  }
  console.log(respuesta.json())
  console.log(respuesta.ok)
  return respuesta.json()
}

export async function obtenerProductoPorId(id) {
  // Con un JSON estático traemos la lista y buscamos. Con un servidor sería:
  // fetch(`${URL_BASE}/productos/${id}`)
  const productos = await obtenerProductos()
  const producto = productos.find((p) => p.id === Number(id))
  if (!producto) {
    throw new Error('El producto que buscás no existe')
  }
  return producto
}

export async function obtenerDestacados() {
  const productos = await obtenerProductos()
  return productos.filter((p) => p.destacado)
}
