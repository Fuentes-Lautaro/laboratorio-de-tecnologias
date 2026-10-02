import { redirect } from 'react-router'

const URL_BASE = '/backend/data'
const CLAVE_SESION = 'vinoteca:sesion'

export async function verificarEmailExistente(email) {
  const respuesta = await fetch(`${URL_BASE}/clientes.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar con el servidor. Intentá más tarde.')
  }

  const usuarios = await respuesta.json()
  const emailLimpio = email.trim().toLowerCase()

  // Compara contra las propiedades 'mail' o 'email' por compatibilidad                   ****revisar*****
  return usuarios.some(
    (u) => (u.mail && u.mail.trim().toLowerCase() === emailLimpio) ||
           (u.email && u.email.trim().toLowerCase() === emailLimpio)
  )
}

// ====================================================================================
// 1. INICIO DE SESIÓN PARA CLIENTES (Tienda / Suscripciones)
// ====================================================================================
/**
 * Valida credenciales contra clientes.json y guarda la sesión en sessionStorage.
 */
export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${URL_BASE}/clientes.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo verificar el usuario. Intentá más tarde.')
  }

  const clientes = await respuesta.json()
  const emailLimpio = email.trim().toLowerCase()

  const cliente = clientes.find((c) => {
    const mailCliente = (c.mail || c.email || '').trim().toLowerCase()
    return mailCliente === emailLimpio && String(c.clave || c.password) === String(password)
  })

  if (!cliente) {
    throw new Error('Email o contraseña incorrectos.')
  }

  // Guardamos la sesión con el DNI (clave fundamental para consultar suscripciones)
  // Nunca guardamos la contraseña en la sesión.
  const sesion = { 
    dni: cliente.dni, 
    nombre: cliente.nombre, 
    email: cliente.mail || cliente.email, 
    rol: cliente.rol 
  }
  
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}

// ====================================================================================
// 2. INICIO DE SESIÓN PARA EMPLEADOS (Panel de Gestión)
// ====================================================================================
export async function iniciarSesionEmpleado(email, password) {
  const respuesta = await fetch(`${URL_BASE}/empleados.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo verificar el usuario de gestión.')
  }

  const empleados = await respuesta.json()
  const emailLimpio = email.trim().toLowerCase()

  const empleado = empleados.find((e) => {
    const mailEmp = (e.mail || e.email || '').trim().toLowerCase()
    return mailEmp === emailLimpio && String(e.clave || e.password) === String(password)
  })

  if (!empleado) {
    throw new Error('Email o contraseña de empleado incorrectos.')
  }

  const sesion = { 
    id: empleado.id,
    dni: empleado.dni, 
    nombre: empleado.nombre, 
    email: empleado.mail || empleado.email, 
    rol: empleado.rol, // Gerente, CM, Empleado
    tipo: 'empleado'
  }
  
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}


export function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION)
}

// React Router: Loaders
export function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion) {
    throw redirect('/login')
  }
  return sesion
}

export function redirigirSiHaySesion() {
  if (obtenerSesion()) {
    throw redirect('/gestion')
  }
  return null
}