const BASE_URL = '/backend/data'; 

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

export async function crearCliente(nuevoCliente) {
  return { id: Date.now(), ...nuevoCliente };
}

export async function actualizarCliente(id, clienteActualizado) {
  return { id, ...clienteActualizado };
}

export async function eliminarCliente(id) {
  return true;
}