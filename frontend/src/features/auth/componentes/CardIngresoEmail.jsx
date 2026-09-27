import React, { useState } from 'react';

export function CardIngresoEmail({ onVerificarEmail, cargando }) {
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      onVerificarEmail(emailInput.trim());
    }
  };

  return (
    <div className="card-auth-flujo">
      <div className="text-center mb-4">
        <h3 className="titulo-auth mb-1">¡Te damos la bienvenida!</h3>
        <p className="text-muted small">
          Ingresá tu correo electrónico para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="form-label fw-semibold small text-secondary">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            className="form-control form-control-lg fs-6"
            placeholder="ejemplo@correo.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            disabled={cargando}
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-auth-submit w-100"
            disabled={cargando || !emailInput.trim()}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Verificando...
              </>
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardIngresoEmail;