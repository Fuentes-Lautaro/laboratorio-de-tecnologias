import { obtenerSesion, cerrarSesion } from '../../auth';

const URL_BASE = `${import.meta.env.VITE_API_URL}/api`;

async function procesarRespuesta(respuesta, mensajeError) {
  // Si el token venció o no está autorizado, expulsa la sesión y manda a /login
  if (respuesta.status === 401 || respuesta.status === 403) {
    cerrarSesion();
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, volvé a iniciar sesión.');
  }

  if (!respuesta.ok) {
    const err = await respuesta.json().catch(() => ({}));
    throw new Error(err.error || err.mensaje || mensajeError);
  }

  return respuesta.json();
}

// Normaliza las columnas pe_* de PostgreSQL al formato que usan las tablas y modales
function normalizarPersona(p) {
  if (!p) return null;
  const fechaRaw = p.pe_fechanac ?? p.pe_fechaNac ?? p.fechaNac ?? '';
  return {
    id: p.pe_id ?? p.id,
    dni: p.pe_dni ?? p.dni ?? '',
    nombre: p.pe_nombre ?? p.nombre ?? '',
    fechaNac: fechaRaw ? String(fechaRaw).split('T')[0] : '',
    telefono: p.pe_telefono ?? p.telefono ?? '',
    mail: p.pe_mail ?? p.mail ?? '',
    direccion: p.pe_direccion ?? p.direccion ?? '',
    rol: (p.pe_rol ?? p.rol ?? 'cliente').toLowerCase(),
    activo: p.pe_activo ?? p.activo ?? true
  };
}

// --- SERVICIOS ---

export async function getPersonas(params = null) {
  const sesion = obtenerSesion();
  let url = `${URL_BASE}/personas`;

  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url = `${URL_BASE}/personas?${query}`;
  } else if (typeof params === 'string' && params.trim() !== '') {
    url = `${URL_BASE}/personas?tipo=${encodeURIComponent(params.trim())}`;
  }

  const respuesta = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  const datos = await procesarRespuesta(respuesta, 'No se pudieron obtener las personas');
  return Array.isArray(datos) ? datos.map(normalizarPersona) : [];
}

export async function getPersonaPorId(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/personas/${id}`, {
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  const dato = await procesarRespuesta(respuesta, 'La persona que buscás no existe');
  return normalizarPersona(dato);
}

export async function crearPersona(datosPersona) {
  const sesion = obtenerSesion();
  const payload = {
    dni: datosPersona.dni,
    nombre: datosPersona.nombre,
    fechaNac: datosPersona.fechaNac,
    telefono: datosPersona.telefono,
    mail: datosPersona.mail,
    direccion: datosPersona.direccion,
    password: datosPersona.password || datosPersona.clave,
    rol: datosPersona.rol ? datosPersona.rol.toLowerCase() : 'cliente'
  };

  const respuesta = await fetch(`${URL_BASE}/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(payload)
  });

  const creado = await procesarRespuesta(respuesta, 'Error al crear la persona');
  return normalizarPersona(creado);
}

export async function actualizarPersona(id, datosPersona) {
  const sesion = obtenerSesion();
  const payload = {
    nombre: datosPersona.nombre,
    telefono: datosPersona.telefono,
    direccion: datosPersona.direccion,
    fechaNac: datosPersona.fechaNac,
    rol: datosPersona.rol ? datosPersona.rol.toLowerCase() : undefined,
    password: datosPersona.password || datosPersona.clave || undefined
  };

  const respuesta = await fetch(`${URL_BASE}/personas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion?.token}`
    },
    body: JSON.stringify(payload)
  });

  const actualizado = await procesarRespuesta(respuesta, 'Error al actualizar la persona');
  return normalizarPersona(actualizado);
}

export async function cambiarEstadoPersona(id) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/personas/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  const actualizado = await procesarRespuesta(respuesta, 'Error al cambiar el estado de la persona');
  return normalizarPersona(actualizado);
}