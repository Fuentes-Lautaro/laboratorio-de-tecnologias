export function TablaVentas({ ventas = [], onVerDetalle }) {
  if (ventas.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center text-muted py-4">
          No se encontraron ventas registradas.
        </td>
      </tr>
    );
  }

  return (
    <>
      {ventas.map((venta) => (
        <tr key={venta.codigo || venta.id}>
          <td className="fw-semibold">{venta.codigo}</td>
          <td>
            {venta.fecha
              ? new Date(venta.fecha).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-'}
          </td>
          <td>{venta.clienteNombre || '-'}</td>
          <td>
            {venta.eventoNombre ? (
              <span
                className="badge rounded-pill px-2 py-1 fw-semibold"
                style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A' }}
              >
                {venta.eventoNombre}
              </span>
            ) : (
              <span className="text-muted">-</span>
            )}
          </td>
          <td>{venta.metodoPago || 'Efectivo'}</td>
          <td className="fw-bold">${Number(venta.monto || 0).toLocaleString()}</td>
          <td className="text-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onVerDetalle(venta)}
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