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

    // 1. Validar Nombre: sin números, al menos una separación de espacio (Nombre + Apellido)
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regexNombre.test(formData.nombre.trim())) {
      setErrorLocal('El nombre completo no debe contener números ni caracteres especiales.');
      return;
    }
    const partesNombre = formData.nombre.trim().split(/\s+/);
    if (partesNombre.length < 2 || partesNombre.some(p => p.length < 2)) {
      setErrorLocal('Por favor ingresá al menos un nombre y un apellido válidos.');
      return;
    }

    // 2. Validar DNI: exactamente 8 dígitos numéricos
    const regexDni = /^\d{8}$/;
    if (!regexDni.test(formData.dni.trim())) {
      setErrorLocal('El DNI debe contener exactamente 8 números.');
      return;
    }

    // 3. Validar Fecha de Nacimiento (Años desde 1926 y mayor de 18 años)
    if (!formData.fechaNac) {
      setErrorLocal('Ingresá tu fecha de nacimiento.');
      return;
    }

    const fechaNacimiento = new Date(formData.fechaNac);
    const anioNacimiento = fechaNacimiento.getFullYear();

    if (anioNacimiento < 1926) {
      setErrorLocal('El año de nacimiento no puede ser anterior a 1926.');
      return;
    }

    // Calcular la edad exacta
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      setErrorLocal('Debes ser mayor de 18 años para registrarte.');
      return;
    }

    // 4. Validar Coincidencia de Contraseñas
    if (formData.clave !== formData.confirmarClave) {
      setErrorLocal('Las contraseñas no coinciden.');
      return;
    }

    if (formData.clave.length < 6) {
      setErrorLocal('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Si todo sale bien, enviamos los datos
    onRegistro({
      nombre: formData.nombre.trim(),
      dni: formData.dni.trim(),
      telefono: formData.telefono.trim(),
      fechaNac: formData.fechaNac,
      direccion: formData.direccion.trim(),
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
            <label className="form-label fw-semibold small text-secondary mb-1">DNI</label>
            <input
              type="text"
              name="dni"
              maxLength="8"
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
              min="1926-01-01"
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