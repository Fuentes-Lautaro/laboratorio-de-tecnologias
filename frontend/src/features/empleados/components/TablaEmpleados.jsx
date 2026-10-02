export function TablaEmpleados({ empleados, getEstiloRol, onEditar, onToggleEstado }) {
  if (empleados.length === 0) {
    return (
      <tr>
        <td colSpan="6" className="text-center py-4 text-muted">
          No se encontraron empleados.
        </td>
      </tr>
    );
  }

  return (
    <>
      {empleados.map(empleado => (
        <tr key={empleado.dni} style={{ opacity: empleado.activo ? 1 : 0.6 }}>
          <td className="fw-semibold" style={{ color: 'var(--texto)' }}>{empleado.nombre}</td>
          <td style={{ color: 'var(--texto)' }}>{empleado.dni}</td>
          <td style={{ color: 'var(--texto)' }}>{empleado.mail}</td>
          
          <td>
            <span 
              className="badge px-3 py-2 shadow-sm" 
              style={{ 
                ...getEstiloRol(empleado.rol), 
                letterSpacing: '0.5px', 
                fontWeight: '600',
                borderRadius: '6px'
              }}
            >
              {empleado.rol}
            </span>
          </td>

          <td>
            <span className={`badge bg-${empleado.activo ? 'success' : 'secondary'} bg-opacity-25 text-${empleado.activo ? 'success' : 'secondary'} px-2 py-1`}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          
          <td className="text-end">
            <div className="d-flex gap-2 justify-content-end">
              <button 
                onClick={() => onEditar(empleado)} 
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                ✏️ Editar
              </button>
              <button 
                onClick={() => onToggleEstado(empleado)} 
                className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${empleado.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                style={{ fontSize: '0.85rem' }}
              >
                {empleado.activo ? '🚫 Baja' : '✅ Alta'}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default TablaEmpleados;