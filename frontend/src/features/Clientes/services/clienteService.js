const BASE_URL = '/backend/data'; 

// GET: Obtener todos los clientes
export async function getClientes() {
  const res = await fetch(`${BASE_URL}/clientes.json`);
  if (!res.ok) throw new Error('Error al cargar la lista de clientes');
  return await res.json();
}

export async function getClientePorId(dni) {
  try {
    const clientes = await getClientes();
    return clientes.find(c => c.dni === dni) || null;
  } catch (error) {
    console.error('Error al obtener el cliente por DNI:', error);
    return null;
  }
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