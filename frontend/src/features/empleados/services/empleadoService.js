const  BASE_URL = '/backend/data';

export async function getEmpleados() {
    const res = await fetch(`${BASE_URL}/empleados.json`);
    if (!res.ok) throw new Error('Error al cargar la lista de empleados');
    return await res.json();
}


//  Crear empleado (Simulado en memoria)
export async function crearEmpleado(nuevoEmpleado) {
  return { id: Date.now(), ...nuevoEmpleado };
}

// Actualizar empleado (Simulado en memoria)
export async function actualizarEmpleado(id, empleadoActualizado) {
  return { id, ...empleadoActualizado };
}

//  Eliminar empleado (Simulado en memoria)
export async function eliminarEmpleado(id) {
  return true;
}