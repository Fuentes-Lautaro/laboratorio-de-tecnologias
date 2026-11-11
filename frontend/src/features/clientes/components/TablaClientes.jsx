export function TablaClientes({ clientes, onVer, onEditar, onToggleEstado }) {
  if (clientes.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center py-4 text-muted">
          No se encontraron clientes.
        </td>
      </tr>
    );
  }

  return (
    <>
      {clientes.map(cliente => (
        <tr key={cliente.dni} style={{ opacity: cliente.activo ? 1 : 0.6 }}>
          <td className="fw-semibold">{cliente.nombre}</td>
          <td>{cliente.dni}</td>
          <td>{cliente.mail}</td>
          <td>
            <span className={`badge bg-${cliente.activo ? 'success' : 'secondary'} bg-opacity-25 text-${cliente.activo ? 'success' : 'secondary'}`}>
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td className="text-end">
            <div className="d-flex gap-2 justify-content-end">
              <button 
                onClick={() => onVer(cliente)} 
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                Ver
              </button>
              
              <button 
                onClick={() => onEditar(cliente)} 
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                Editar
              </button>
              
              <button 
                onClick={() => onToggleEstado(cliente)} 
                className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${cliente.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                style={{ fontSize: '0.85rem' }}
              >
                {cliente.activo ? 'Baja' : 'Alta'}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default TablaClientes;