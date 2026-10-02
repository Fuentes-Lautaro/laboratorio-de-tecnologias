import React, { useState } from 'react';

export function CardPagarSuscripcion({ plan, cliente, onConfirmarPago, onVolver, cargando }) {
  const [metodoPago, setMetodoPago] = useState('mercadopago');

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    //LLAMADO A LA API?
    onConfirmarPago({
      fechaPago: new Date().toISOString().split('T')[0],
      metodoPago: 'Mercado Pago',
      monto: plan?.valor || 0
    });
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="text-center mb-4" style={{ color: 'var(--titulos, #4a1525)' }}>
        Confirmar y Pagar
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Detalle del Plan */}
        <div className="card bg-light p-3 mb-3 border-0">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted small">Plan Seleccionado</span>
            <span className="badge bg-secondary">{plan?.Nombre || 'Suscripción'}</span>
          </div>
          <h5 className="fw-bold mb-1">{plan?.Nombre}</h5>
          <p className="text-muted small mb-2">{plan?.Descripcion}</p>
        </div>

        {/* Detalles de la Transacción */}
        <div className="mb-3">
          <h6 className="fw-bold border-bottom pb-2 mb-2">Detalles de la transacción</h6>
          <div className="d-flex justify-content-between py-1">
            <span className="text-muted small">Fecha de suscripción:</span>
            <span className="fw-semibold small">{fechaHoy}</span>
          </div>
          <div className="d-flex justify-content-between py-1">
            <span className="text-muted small">Titular:</span>
            <span className="fw-semibold small">{cliente?.nombre || cliente?.email}</span>
          </div>
          <div className="d-flex justify-content-between py-2 border-top mt-2">
            <span className="fw-bold">Monto Total:</span>
            <span className="fw-bold fs-5 text-success">
              ${plan?.valor?.toLocaleString('es-AR') || '0'} / mes
            </span>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="mb-4">
          <label className="form-label fw-bold small">Método de Pago</label>
          <div className="form-check border rounded p-3 bg-white d-flex align-items-center justify-content-between">
            <div>
              <input
                className="form-check-input me-2"
                type="radio"
                name="metodoPago"
                id="mp"
                checked={metodoPago === 'mercadopago'}
                onChange={() => setMetodoPago('mercadopago')}
              />
              <label className="form-check-label fw-semibold" htmlFor="mp">
                Mercado Pago
              </label>
            </div>
            <span className="badge bg-info text-dark">Simulación</span>
          </div>
        </div>

        {/* Botón Pagar */}
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-dark btn-lg fw-bold"
            disabled={cargando}
            style={{ backgroundColor: 'var(--titulos, #4a1525)', borderColor: 'var(--titulos, #4a1525)' }}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Procesando pago...
              </>
            ) : (
              `Pagar $${plan?.valor?.toLocaleString('es-AR') || ''}`
            )}
          </button>

          {onVolver && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onVolver}
              disabled={cargando}
            >
              Atrás
            </button>
          )}
        </div>
      </form>
    </div>
  );
}