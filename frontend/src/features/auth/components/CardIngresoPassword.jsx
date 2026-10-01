import React, { useState } from 'react';

export function CardIngresoPassword({ email, onLogin, onVolver, cargando }) {
  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave) {
      onLogin(clave);
    }
  };

  return (
    <div className="card-auth-flujo">
      <div className="text-center mb-3">
        <h3 className="titulo-auth mb-1">Ingresá tu contraseña</h3>
        <span className="badge bg-light text-dark border px-3 py-2 mt-2 rounded-pill small">
          {email}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-4">
          <label htmlFor="clave" className="form-label fw-semibold small text-secondary">
            Contraseña
          </label>
          <input
            type="password"
            id="clave"
            className="form-control form-control-lg fs-6"
            placeholder="••••••••"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            disabled={cargando}
          />
        </div>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-auth-submit w-100"
            disabled={cargando || !clave}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Iniciando sesión...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

          {onVolver && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm border-0 text-muted"
              onClick={onVolver}
              disabled={cargando}
            >
              ← Usar otro correo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CardIngresoPassword;