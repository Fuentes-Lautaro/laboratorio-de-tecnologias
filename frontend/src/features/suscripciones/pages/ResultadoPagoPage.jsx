import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verificarPagoSuscripcion } from '../services/suscripcionesService';

export function ResultadoPagoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status') || searchParams.get('collection_status');
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

  const [estadoVista, setEstadoVista] = useState('VERIFICANDO'); // VERIFICANDO | APROBADO | PENDIENTE | RECHAZADO
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    async function confirmar() {
      if (status === 'approved' && paymentId) {
        try {
          await verificarPagoSuscripcion(paymentId);
          setEstadoVista('APROBADO');
        } catch (err) {
          setMensajeError(err.message || 'No se pudo confirmar el pago.');
          setEstadoVista('RECHAZADO');
        }
      } else if (status === 'pending' || status === 'in_process') {
        setEstadoVista('PENDIENTE');
      } else {
        setEstadoVista('RECHAZADO');
      }
    }

    confirmar();
  }, [status, paymentId]);

  return (
    <section className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 p-4 text-center" style={{ maxWidth: '480px', width: '100%' }}>
        
        {estadoVista === 'VERIFICANDO' && (
          <>
            <div className="spinner-border text-secondary mx-auto mb-3" role="status" />
            <h4 className="fw-bold">Confirmando tu suscripción...</h4>
            <p className="text-muted small mb-0">Estamos validando tu pago con Mercado Pago.</p>
          </>
        )}

        {estadoVista === 'APROBADO' && (
          <>
            <div className="fs-1 text-success mb-2">✓</div>
            <h4 className="fw-bold text-success mb-2">¡Suscripción activada!</h4>
            <p className="text-muted small mb-4">
              Tu pago (Operación #{paymentId}) fue aprobado y tu membresía ya se encuentra activa.
            </p>
            <button
              className="btn text-white w-100"
              style={{ backgroundColor: 'var(--titulos, #4a1525)' }}
              onClick={() => navigate('/mi-suscripcion', { replace: true })}
            >
              Ver mi suscripción
            </button>
          </>
        )}

        {estadoVista === 'PENDIENTE' && (
          <>
            <div className="fs-1 text-warning mb-2">⏳</div>
            <h4 className="fw-bold text-warning mb-2">Pago pendiente</h4>
            <p className="text-muted small mb-4">
              Tu pago está siendo procesado por Mercado Pago. Apenas se acredite, tu suscripción se activará automáticamente.
            </p>
            <button className="btn btn-outline-dark w-100" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </>
        )}

        {estadoVista === 'RECHAZADO' && (
          <>
            <div className="fs-1 text-danger mb-2">✕</div>
            <h4 className="fw-bold text-danger mb-2">No se pudo completar el pago</h4>
            <p className="text-muted small mb-4">
              {mensajeError || 'El pago fue rechazado o cancelado. No se realizó ningún cargo.'}
            </p>
            <button
              className="btn btn-outline-dark w-100"
              onClick={() => navigate('/suscripciones', { replace: true })}
            >
              Volver a intentar
            </button>
          </>
        )}

      </div>
    </section>
  );
}

export default ResultadoPagoPage;