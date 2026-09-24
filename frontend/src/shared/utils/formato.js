// Funciones puras: reciben un valor y devuelven otro, sin estado ni marcado.

export function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)
}

export function formatearFecha(fechaISO) {
  // Se agrega la hora para que no se corra un día por la zona horaria.
  return new Intl.DateTimeFormat('es-AR').format(new Date(`${fechaISO}T00:00:00`))
}

export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
