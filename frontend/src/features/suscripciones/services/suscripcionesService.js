import { obtenerSesion } from '../../auth';


const API_URL = import.meta.env.VITE_API_URL;
const URL_DATA_SIMULADA = '/backend/data'; 

const mapearPlanDesdeDB = (planDB) => ({
  id: planDB.ps_id,
  nombre: planDB.ps_nombre,
  descripcion: planDB.ps_descripcion,
  cantidad_vinos: planDB.ps_cantidad_vinos,
  valor: Number(planDB.ps_valor),
  activo: planDB.ps_activo,
  productos_proximo_mes: planDB.productos_proximo_mes || []
});

// ==========================================
// PLANES 
// ==========================================

export async function getPlanes() {
  const respuesta = await fetch(`${API_URL}/api/planes`);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los planes de suscripción');
  }
  const datos = await respuesta.json();
  return datos.map(mapearPlanDesdeDB);
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

export async function crearPlan({ nombre, descripcion, cantidadVinos, valor }) {
   const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}/api/planes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${sesion?.token}`
     },
    body: JSON.stringify({ nombre, descripcion, cantidadVinos, valor })
  });

  if (!respuesta.ok) {
    throw new Error('Error al crear el plan');
  }
  const nuevoPlan = await respuesta.json();
  return mapearPlanDesdeDB(nuevoPlan);
}

export async function modificarPlan(id, { nombre, descripcion, cantidadVinos, valor }) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}/api/planes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${sesion?.token}`
     },
    body: JSON.stringify({ nombre, descripcion, cantidadVinos, valor })
  });

  if (!respuesta.ok) {
    throw new Error('Error al modificar el plan');
  }
  const planActualizado = await respuesta.json();
  return mapearPlanDesdeDB(planActualizado);
}

export async function alternarEstadoPlan(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}/api/planes/${id}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${sesion?.token}` }
  });

  if (!respuesta.ok) {
    throw new Error('Error al cambiar el estado del plan');
  }
  const planActualizado = await respuesta.json();
  return mapearPlanDesdeDB(planActualizado);
}

export async function eliminarPlan(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}/api/planes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sesion?.token}` }
  });

  if (!respuesta.ok) {
    throw new Error('Error al eliminar el plan');
  }
  return true;
}

/**
 * Obtiene los productos del próximo mes para un plan específico 
 */
export async function getProductosProximoMesPorPlan(planId) {
  try {
    const planes = await getPlanes();
    const planEncontrado = planes.find((p) => Number(p.id) === Number(planId));
    return planEncontrado ? planEncontrado.productos_proximo_mes : [];
  } catch (error) {
    console.error('Error al obtener los productos del próximo mes:', error);
    return [];
  }
}

export async function getProductosParaPlanes() {
  const respuesta = await fetch(`${API_URL}/api/productos`); 
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos');
  }
  return await respuesta.json();
}

export async function guardarRegistroMes(planId, periodo, productos) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}/api/planes/registroMes/${planId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${sesion?.token}`
     },
    body: JSON.stringify({ planId, periodo, productos })
  });

  if (!respuesta.ok) {
    throw new Error('Error al guardar los productos del mes en la base de datos');
  }
  return await respuesta.json();
}

// ==========================================
// SUSCRIPCIONES Y REGISTROS (Aún en JSON)
// ==========================================

export async function getSuscripciones() {
  const respuesta = await fetch(`${URL_DATA_SIMULADA}/suscripciones.json`);
  
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las suscripciones');
  }
  
  return respuesta.json();
}

export async function getSuscripcionActivaPorDni(clienteDni) {
  try {
    const respuesta = await fetch(`${URL_DATA_SIMULADA}/suscripciones.json`);
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con la base de suscripciones.');
    }

    const suscripciones = await respuesta.json();

    const suscripcionActiva = suscripciones.find((sub) => {
      return String(sub.dni_cliente).trim() === String(clienteDni).trim() && 
             sub.activa === true;
    });

    if (!suscripcionActiva) return null;

    const planes = await getPlanes();
    const planEncontrado = planes.find(p => p.id === suscripcionActiva.plan_id);

    return {
      ...suscripcionActiva,
      planNombre: planEncontrado ? planEncontrado.nombre : 'Especial'
    };

  } catch (error) {
    console.error('Error al obtener la suscripción activa:', error);
    throw error;
  }
}

