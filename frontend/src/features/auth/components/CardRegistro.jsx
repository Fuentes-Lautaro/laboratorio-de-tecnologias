import React, { useState } from 'react';

export function CardRegistro({ email, onRegistro, onVolver, cargando, errorBackend }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    fechaNac: '',
    direccion: '',
    clave: '',
    confirmarClave: ''
  });

  const [errorLocal, setErrorLocal] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorLocal) setErrorLocal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorLocal('');

    if (formData.clave !== formData.confirmarClave) {
      setErrorLocal('Las contraseñas no coinciden.');
      return;
    }

    if (formData.clave.length < 6) {
      setErrorLocal('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    onRegistro({
      nombre: formData.nombre,
      dni: formData.dni,
      telefono: formData.telefono,
      fechaNac: formData.fechaNac,
      direccion: formData.direccion,
      password: formData.clave,
      mail: email,
      rol: 'cliente'
    });
  };

  return (
    <div className="card-auth-flujo">
      <div className="text-center mb-3">
        <h3 className="titulo-auth mb-1">Creá tu cuenta</h3>
        <p className="text-muted small mb-1">
          Completá tus datos personales para suscribirte
        </p>
        <span className="badge bg-light text-dark border px-3 py-1 rounded-pill small">
          {email}
        </span>
      </div>

      {(errorLocal || errorBackend) && (
        <div className="alert alert-danger py-2 mb-3 text-center small" role="alert">
          {errorLocal || errorBackend}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2" autoComplete="off">
        <div className="row g-2">
          <div className="col-12">
            <label className="form-label fw-semibold small text-secondary mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              autoComplete="off"
              className="form-control form-control-sm"
              placeholder="María Balbina"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-6">
            <label className="form-label fw-semibold small text-secondary mb-1">DNI / CUIT</label>
            <input
              type="text"
              name="dni"
              autoComplete="off"
              className="form-control form-control-sm"
              placeholder="12345678"
              value={formData.dni}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-6">
            <label className="form-label fw-semibold small text-secondary mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              autoComplete="off"
              className="form-control form-control-sm"
              placeholder="2664123456"
              value={formData.telefono}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold small text-secondary mb-1">Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNac"
              autoComplete="off"
              className="form-control form-control-sm"
              value={formData.fechaNac}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold small text-secondary mb-1">Dirección de Envío</label>
            <input
              type="text"
              name="direccion"
              autoComplete="off"
              className="form-control form-control-sm"
              placeholder="Av. Illia 123, San Luis"
              value={formData.direccion}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-6 mb-3">
            <label className="form-label fw-semibold small text-secondary mb-1">Contraseña</label>
            <input
              type="password"
              name="clave"
              autoComplete="new-password"
              className={`form-control form-control-sm ${errorLocal ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={formData.clave}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>

          <div className="col-6 mb-3">
            <label className="form-label fw-semibold small text-secondary mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmarClave"
              autoComplete="new-password"
              className={`form-control form-control-sm ${errorLocal ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={formData.confirmarClave}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </div>
        </div>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-auth-submit w-100"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Registrando...
              </>
            ) : (
              'Registrarme y Pagar'
            )}
          </button>

          {onVolver && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm border-0 text-muted"
              onClick={onVolver}
              disabled={cargando}
            >
              ← Volver
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CardRegistro;