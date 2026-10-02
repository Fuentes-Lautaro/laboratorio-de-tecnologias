export function TablaVentas({ ventas, onVerDetalle }) {
  if (ventas.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center py-4 text-muted">
          No hay ventas registradas.
        </td>
      </tr>
    );
  }

  return (
    <>
      {ventas.map((v) => (
        <tr key={v.codigo || v.id}>
          <td className="fw-semibold">{v.codigo}</td>
          <td>{v.fecha}</td>
          <td>{v.clienteDni || 'Consumidor Final'}</td>
          <td>{v.empleadoDni || 'Sin asignar'}</td>
          <td>
            <span className="badge bg-light text-dark border">{v.metodoPago}</span>
          </td>
          <td className="fw-bold text-success">
            ${Number(v.monto || v.total || 0).toLocaleString()}
          </td>
          <td className="text-end">
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onVerDetalle(v)}
            >
              Ver Detalle
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}

export default TablaVentas;