import { redirect } from 'react-router';

const API_URL = 'http://localhost:3000/api';
const URL_BASE = '/backend/data';
const CLAVE_SESION = 'vinoteca:sesion';

// Verificación auxiliar de email existente
export async function verificarEmailExistente(email) {
  const respuesta = await fetch(`${URL_BASE}/clientes.json`);
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar con el servidor. Intentá más tarde.');
  }

  const usuarios = await respuesta.json();
  const emailLimpio = email.trim().toLowerCase();

  return usuarios.some(
    (u) =>
      (u.mail && u.mail.trim().toLowerCase() === emailLimpio) ||
      (u.email && u.email.trim().toLowerCase() === emailLimpio)
  );
}

export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mail: email, password })
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(data.error || 'Email o contraseña incorrectos.');
  }

  const sesion = {
    token: data.token,
    rol: data.rol,
    email: email
  };

  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
}

// Redirección para rutas públicas si ya hay sesión iniciada
export function redirigirSiHaySesion() {
  if (obtenerSesion()) {
    throw redirect('/');
  }
  return null;
}

// FUNCIONES DE MANEJO DE SESIÓN
export function obtenerSesion() {
  try {
    const sesion = sessionStorage.getItem(CLAVE_SESION);
    return sesion ? JSON.parse(sesion) : null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

// Protección de rutas privadas (/gestion y /cm)
export function protegerRuta() {
  const sesion = obtenerSesion();

  if (!sesion || !sesion.token) {
    throw redirect('/login');
  }

  const rol = sesion.rol?.toLowerCase() || '';
  const rolesPermitidos = ['gerente', 'vendedor', 'cm'];

  if (!rolesPermitidos.includes(rol)) {
    throw redirect('/');
  }

  return sesion;
}