const  BASE_URL = '/backend/data';

export async function getEmpleados() {
    const res = await fetch(`${BASE_URL}/empleados.json`);
    if (!res.ok) throw new Error('Error al cargar la lista de empleados');
    return await res.json();
}

export async function crearEmpleado(nuevoEmpleado) {
  return { id: Date.now(), ...nuevoEmpleado };
}

export async function actualizarEmpleado(id, empleadoActualizado) {
  return { id, ...empleadoActualizado };
}

export async function eliminarEmpleado(id) {
  return true;
}