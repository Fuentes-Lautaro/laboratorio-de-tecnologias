import React from 'react';

export function CardPagarSuscripcion({
  plan,
  cliente,
  onConfirmarPago,
  onVolver,
  cargando = false,
}) {
  const nombrePlan = plan?.nombre || plan?.ps_nombre || 'Plan de Suscripción';
  const descripcionPlan = plan?.descripcion || plan?.ps_descripcion || '';
  const valorPlan = Number(plan?.valor ?? plan?.ps_valor ?? 0);
  const beneficios = Array.isArray(plan?.beneficios) ? plan.beneficios : [];

  const nombreCliente = cliente?.nombre || 'Cliente';
  const emailCliente = cliente?.email || cliente?.mail || '';
  const dniCliente = cliente?.dni || '';

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      {/* Encabezado */}
      <div
        className="px-4 py-3 text-white d-flex justify-content-between align-items-center"
        style={{ backgroundColor: '#3E100F' }}
      >
        <div>
          <span
            className="text-uppercase d-block"
            style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#E5C5A5' }}
          >
            Confirmación de suscripción
          </span>
          <h5 className="mb-0 fw-bold">{nombrePlan}</h5>
        </div>
        <span
          className="badge rounded-pill px-3 py-2 fw-semibold"
          style={{ backgroundColor: '#B5865A', color: '#FFFFFF', fontSize: '0.75rem' }}
        >
          Mensual
        </span>
      </div>

      <div className="card-body p-4">
        {/* Descripción / Beneficios del plan */}
        {descripcionPlan && (
          <p className="text-muted small mb-3">{descripcionPlan}</p>
        )}

        {beneficios.length > 0 && (
          <ul className="list-unstyled small mb-3 d-flex flex-column gap-1">
            {beneficios.map((item, idx) => (
              <li key={idx} className="d-flex align-items-start gap-2 text-dark">
                <span style={{ color: '#B5865A', fontWeight: 'bold' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Resumen de Monto */}
        <div
          className="rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: '#F1EFEA', border: '1px solid rgba(181, 134, 90, 0.25)' }}
        >
          <div>
            <span className="d-block small text-muted">Total a abonar hoy</span>
            <span className="small fw-medium" style={{ color: '#513B2A' }}>
              Abono mensual · ARS
            </span>
          </div>
          <div className="text-end">
            <span className="h4 fw-bold mb-0" style={{ color: '#3E100F' }}>
              ${valorPlan.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Datos del Titular */}
        <div className="border rounded-3 p-3 mb-3 bg-light bg-opacity-50 small">
          <div
            className="text-uppercase fw-bold mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.8px', color: '#513B2A' }}
          >
            Titular de la membresía
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Nombre:</span>
            <span className="fw-semibold text-dark">{nombreCliente}</span>
          </div>
          {emailCliente && (
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Correo:</span>
              <span className="fw-medium text-dark text-truncate ms-2">{emailCliente}</span>
            </div>
          )}
          {dniCliente && (
            <div className="d-flex justify-content-between">
              <span className="text-muted">DNI:</span>
              <span className="fw-medium text-dark">{dniCliente}</span>
            </div>
          )}
        </div>

        {/* Bloque informativo de Mercado Pago Checkout Pro */}
        <div
          className="rounded-3 p-3 mb-4 d-flex align-items-center gap-3"
          style={{
            backgroundColor: 'rgba(0, 158, 227, 0.07)',
            border: '1px solid rgba(0, 158, 227, 0.28)',
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
            style={{ width: '38px', height: '38px', backgroundColor: '#009EE3', fontSize: '0.85rem' }}
          >
            MP
          </div>
          <div className="small lh-sm">
            <div className="fw-bold text-dark mb-1">Pago seguro con Mercado Pago</div>
            <div className="text-muted" style={{ fontSize: '0.78rem' }}>
              Te redirigiremos a Mercado Pago para abonar con tarjeta de débito, crédito o dinero en cuenta.
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn fw-semibold py-2.5 text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{ backgroundColor: '#009EE3', borderColor: '#009EE3', borderRadius: '0.65rem' }}
            onClick={onConfirmarPago}
            disabled={cargando || !plan}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Conectando con Mercado Pago...</span>
              </>
            ) : (
              <span>Continuar a Mercado Pago</span>
            )}
          </button>

          {onVolver && (
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-muted mt-1"
              onClick={onVolver}
              disabled={cargando}
            >
              &larr; Cambiar de plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardPagarSuscripcion;