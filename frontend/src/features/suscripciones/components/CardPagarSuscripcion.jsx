import React from 'react';

export function CardPagarSuscripcion({
  plan,
  onConfirmarPago,
  onVolver,
  cargando = false,
}) {
  const nombrePlan = plan?.nombre || plan?.ps_nombre || 'Plan de Suscripción';
  const descripcionPlan = plan?.descripcion || plan?.ps_descripcion || '';
  const valorPlan = Number(plan?.valor ?? plan?.ps_valor ?? 0);
  const beneficios = Array.isArray(plan?.beneficios) ? plan.beneficios : [];

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      {/* Encabezado */}
      <div
        className="px-4 py-3 text-white d-flex justify-content-between align-items-center"
        style={{ backgroundColor: 'var(--paneles, #3E100F)' }}
      >
        <div>
          <span
            className="text-uppercase d-block"
            style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#E5C5A5' }}
          >
            Confirmación de pago
          </span>
          <h5 className="mb-0 fw-bold">{nombrePlan}</h5>
        </div>
        <span
          className="badge rounded-pill px-3 py-2 fw-semibold"
          style={{ backgroundColor: 'var(--detalles, #B5865A)', color: '#FFFFFF', fontSize: '0.75rem' }}
        >
          Mensual
        </span>
      </div>

      <div className="card-body p-4">
        {/* Descripción y beneficios del plan */}
        {descripcionPlan && (
          <p className="text-muted small mb-3">{descripcionPlan}</p>
        )}

        {beneficios.length > 0 && (
          <ul className="list-unstyled small mb-3 d-flex flex-column gap-1">
            {beneficios.map((item, idx) => (
              <li key={idx} className="d-flex align-items-start gap-2 text-dark">
                <span style={{ color: 'var(--detalles, #B5865A)', fontWeight: 'bold' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Resumen de Monto */}
        <div
          className="rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: 'var(--fondo-secundario, #F4EFEA)',
            border: '1px solid rgba(181, 134, 90, 0.3)',
          }}
        >
          <div>
            <span className="d-block small text-muted">Total a abonar</span>
            <span className="small fw-medium" style={{ color: 'var(--referencias, #513B2A)' }}>
              Abono mensual · ARS
            </span>
          </div>
          <div className="text-end">
            <span className="h4 fw-bold mb-0" style={{ color: 'var(--paneles, #3E100F)' }}>
              ${valorPlan.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Bloque informativo de Mercado Pago en tonos institucionales */}
        <div
          className="rounded-3 p-3 mb-4 d-flex align-items-center gap-3"
          style={{
            backgroundColor: 'rgba(181, 134, 90, 0.1)',
            border: '1px solid rgba(181, 134, 90, 0.35)',
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--detalles, #B5865A)',
              fontSize: '0.82rem',
            }}
          >
            MP
          </div>
          <div className="small lh-sm">
            <div className="fw-bold mb-1" style={{ color: 'var(--paneles, #3E100F)' }}>
              Pago seguro con Mercado Pago
            </div>
            <div className="text-muted" style={{ fontSize: '0.78rem' }}>
              Te redirigiremos a Mercado Pago para abonar con el metodo de pago que prefieras.
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn fw-semibold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{
              backgroundColor: 'var(--paneles, #3E100F)',
              color: 'var(--fondos-principales, #F9EBE0)',
              border: '1px solid var(--titulos, #64141B)',
              borderRadius: '0.65rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!cargando) {
                e.currentTarget.style.backgroundColor = 'var(--titulos, #64141B)';
                e.currentTarget.style.borderColor = 'var(--detalles, #B5865A)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cargando) {
                e.currentTarget.style.backgroundColor = 'var(--paneles, #3E100F)';
                e.currentTarget.style.borderColor = 'var(--titulos, #64141B)';
              }
            }}
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
              className="btn btn-sm mt-1 fw-medium"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--referencias, #513B2A)',
                border: '1px solid rgba(152, 124, 101, 0.45)',
                borderRadius: '0.65rem',
              }}
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