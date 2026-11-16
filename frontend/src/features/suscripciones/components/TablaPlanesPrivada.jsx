export function TablaSuscripciones({ suscripciones, formatearFecha, onVer }) {
  const formatearFechaLocal = (fechaStr) => {
    if (formatearFecha) return formatearFecha(fechaStr);
    if (!fechaStr) return 'Sin fecha';
    const fechaLimpia = String(fechaStr).split('T')[0];
    const partes = fechaLimpia.split('-');
    if (partes.length === 3) {
      const [anio, mes, dia] = partes;
      return `${dia}/${mes}/${anio}`;
    }
    return fechaStr;
  };

  if (suscripciones.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center py-4 text-muted">
          No se encontraron suscripciones.
        </td>
      </tr>
    );
  }

  return (
    <>
      {suscripciones.map((suscripcion) => (
        <tr key={suscripcion.id} style={{ opacity: suscripcion.activa ? 1 : 0.6 }}>
          <td className="fw-semibold">
            {suscripcion.nombre_cliente || 'Cliente desconocido'}
          </td>
          <td>
            {suscripcion.plan_nombre || `Plan #${suscripcion.plan_id}`}
          </td>
          <td>{suscripcion.metodo_pago || 'No especificado'}</td>
          <td>{formatearFechaLocal(suscripcion.fecha_pago)}</td>
          <td>
            ${typeof suscripcion.monto === 'number'
              ? suscripcion.monto.toLocaleString('es-AR')
              : Number(suscripcion.monto || 0).toLocaleString('es-AR')}
          </td>
          <td>
            <span
              className={`badge bg-${suscripcion.activa ? 'success' : 'secondary'} bg-opacity-25 text-${
                suscripcion.activa ? 'success' : 'secondary'
              }`}
            >
              {suscripcion.activa ? 'Activa' : 'Inactiva (Sin renovar)'}
            </span>
          </td>
          <td className="text-end">
            <div className="d-flex gap-2 justify-content-end">
              <button
                onClick={() => onVer(suscripcion)}
                className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
              >
                Ver
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default TablaSuscripciones;