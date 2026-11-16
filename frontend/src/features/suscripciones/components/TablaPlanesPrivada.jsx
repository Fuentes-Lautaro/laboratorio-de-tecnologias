export function TablaPlanes({ planes, onVer, onEditar, onToggleEstado }) {
  if (!planes || planes.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center py-4 text-muted">
          No se encontraron planes de suscripción.
        </td>
      </tr>
    );
  }

  return (
    <>
      {planes.map((plan) => (
        <tr key={plan.id} style={{ opacity: plan.activo ? 1 : 0.6 }}>
          <td className="fw-semibold">{plan.nombre}</td>
          <td>{plan.cantidad_vinos} unidades</td>
          <td>${Number(plan.valor || 0).toLocaleString('es-AR')}</td>
          <td>
            <span
              className={`badge bg-${plan.activo ? 'success' : 'secondary'} bg-opacity-25 text-${
                plan.activo ? 'success' : 'secondary'
              }`}
            >
              {plan.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td className="text-end">
            <div className="d-flex gap-2 justify-content-end">
              <button
                onClick={() => onVer(plan)}
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                Ver
              </button>

              <button
                onClick={() => onEditar(plan)}
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                Editar
              </button>

              <button
                onClick={() => onToggleEstado(plan)}
                className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${
                  plan.activo ? 'btn-outline-danger' : 'btn-outline-success'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                {plan.activo ? 'Baja' : 'Alta'}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default TablaPlanes;