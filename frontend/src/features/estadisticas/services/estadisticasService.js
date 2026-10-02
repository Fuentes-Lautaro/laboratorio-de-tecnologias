const URL_BASE = '/backend/data'

export async function obtenerResumen() {
  const respuesta = await fetch(`${URL_BASE}/resumen-subs.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo obtener las estadísticas de suscripciones')
  }
  return respuesta.json()
}