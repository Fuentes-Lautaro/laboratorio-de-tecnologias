const URL_BASE = '/backend/data'

export async function getPlanes() {
  const respuesta = await fetch(`${URL_BASE}/planesSuscripciones.json`);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los planes de suscripción');
  }
  return await respuesta.json();
}

/**
 * Busca y devuelve un plan específico según su nombre desde la URL leyendo del JSON real.
 */
export const getPlanesPorNombre = async (nombre) => {
  if (!nombre) return null;

  // 1. Obtenemos la lista de planes directamente desde el JSON
  const planes = await getPlanes();

  // 2. Limpiamos y normalizamos el nombre de la URL
  const nombreLimpio = decodeURIComponent(nombre).trim().toLowerCase();

  // 3. Buscamos la coincidencia en los datos traídos del JSON
  const planEncontrado = planes.find(
    (plan) => plan.Nombre && plan.Nombre.toLowerCase().trim() === nombreLimpio
  );

  if (!planEncontrado) {
    throw new Error(`No se encontró la suscripción con el nombre: "${nombre}"`);
  }

  return planEncontrado;
};

/**
 * Busca si un cliente tiene una suscripción activa por su DNI.
 * @param {string} clienteDni - El DNI del cliente autenticado.
 * @returns {Promise<Object|null>} Devuelve la suscripción activa o null si no tiene.
 */
export async function getSuscripcionActivaPorDni(clienteDni) {
  try {
    const respuesta = await fetch(`${URL_BASE}/suscripciones.json`);
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con la base de suscripciones.');
    }

    const suscripciones = await respuesta.json();

    // Buscamos si existe un registro donde clienteDni coincida y el estado sea "Activa"
    const suscripcionActiva = suscripciones.find(
      (sub) => String(sub.clienteDni) === String(clienteDni) && sub.estado === 'Activa'
    );

    return suscripcionActiva || null;
  } catch (error) {
    console.error('Error al obtener la suscripción activa:', error);
    throw error;
  }
}

