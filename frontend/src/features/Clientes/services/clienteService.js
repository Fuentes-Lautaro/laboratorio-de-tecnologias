const BASE_URL = '/backend/data'; 

// GET: Obtener todos los clientes
export async function obtenerClientes() {
  const res = await fetch(`${BASE_URL}/clientes.json`);
  if (!res.ok) throw new Error('Error al cargar la lista de clientes');
  return await res.json();
}



//  Crear cliente (Simulado en memoria)
export async function crearCliente(nuevoCliente) {
  return { id: Date.now(), ...nuevoCliente };
}

// Actualizar cliente (Simulado en memoria)
export async function actualizarCliente(id, clienteActualizado) {
  return { id, ...clienteActualizado };
}

//  Eliminar cliente (Simulado en memoria)
export async function eliminarCliente(id) {
  return true;
}