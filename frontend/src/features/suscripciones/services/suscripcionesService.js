const URL_BASE = '/backend/data';

export async function getPlanes() {
  const respuesta = await fetch(`${URL_BASE}/planes.json`);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los planes de suscripción');
  }
  return await respuesta.json();
}

export const getPlanPorNombre = async (nombre) => {
  if (!nombre) return null;

  const planes = await getPlanes();
  const nombreLimpio = decodeURIComponent(nombre).trim().toLowerCase();

  const planEncontrado = planes.find(
    (plan) => plan.nombre && plan.nombre.toLowerCase().trim() === nombreLimpio
  );

  if (!planEncontrado) {
    throw new Error(`No se encontró la suscripción con el nombre: "${nombre}"`);
  }

  return planEncontrado;
};

export async function getSuscripciones() {
  const respuesta = await fetch(`${URL_BASE}/suscripciones.json`);
  
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las suscripciones');
  }
  
  return respuesta.json();
}

export async function getSuscripcionActivaPorDni(clienteDni) {
  try {
    const respuesta = await fetch(`${URL_BASE}/suscripciones.json`);
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con la base de suscripciones.');
    }

    const suscripciones = await respuesta.json();

    const suscripcionActiva = suscripciones.find(
      (sub) => String(sub.clienteDni) === String(clienteDni) && sub.estado === 'Activa'
    );

    return suscripcionActiva || null;
  } catch (error) {
    console.error('Error al obtener la suscripción activa:', error);
    throw error;
  }
}

export async function getRegistrosMes() {
  const respuesta = await fetch(`${URL_BASE}/registroMes.json`);
  
  if (!respuesta.ok){
    throw new Error(`Error ${respuesta.status}: No se pudieron obtener los registros de los meses`);
  }
  
  return await respuesta.json();
}