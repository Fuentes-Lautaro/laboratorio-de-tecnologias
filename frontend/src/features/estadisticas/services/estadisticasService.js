import { obtenerSesion, cerrarSesion } from '../../auth'; 

const URL_BASE = 'http://localhost:3000/api';

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

export async function obtenerResumen() {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${URL_BASE}/estadisticas`, {
    headers: {
      'Authorization': `Bearer ${sesion?.token}`
    }
  });

  return procesarRespuesta(respuesta, 'No se pudo obtener el resumen de estadísticas');
}