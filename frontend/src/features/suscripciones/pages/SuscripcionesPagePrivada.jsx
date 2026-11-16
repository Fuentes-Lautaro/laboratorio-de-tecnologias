import React, { useState, useEffect } from 'react';
import { getSuscripciones } from '../services/suscripcionesService';
import TablaSuscripciones from '../components/TablaSuscripcionesPrivada';
import Modal from '../../../shared/components/Modal';

export function SuscripcionesPagePrivada() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState(null);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    const fechaLimpia = String(fechaStr).split('T')[0];
    const partes = fechaLimpia.split('-');
    if (partes.length === 3) {
      const [anio, mes, dia] = partes;
      return `${dia}/${mes}/${anio}`;
    }
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr;
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosSuscripciones = await getSuscripciones();

        const suscripcionesProcesadas = datosSuscripciones.map((s) => ({
          ...s,
          activa: s.activo ?? s.s_activo ?? false,
        }));

        setSuscripciones(suscripcionesProcesadas);
      } catch (err) {
        console.error('Error al obtener las suscripciones:', err);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const suscripcionesFiltradas = suscripciones
    .filter((suscripcion) => {
      const busquedaMinuscula = terminoBusqueda.toLowerCase();
      const nombreCliente = (suscripcion.nombre_cliente || '').toLowerCase();
      const dniCliente = String(suscripcion.dni_cliente || '').toLowerCase();
      const nombrePlan = (suscripcion.plan_nombre || '').toLowerCase();
      const metodoPago = (suscripcion.metodo_pago || '').toLowerCase();

      return (
        nombreCliente.includes(busquedaMinuscula) ||
        dniCliente.includes(busquedaMinuscula) ||
        nombrePlan.includes(busquedaMinuscula) ||
        metodoPago.includes(busquedaMinuscula)
      );
    })
    .sort((a, b) => (b.activa === true) - (a.activa === true));

  const handleVer = (suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    setMostrarModalVer(true);
  };

  const handleBusquedaChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  if (cargando) return <p className="text-center py-5">Cargando suscripciones...</p>;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>
          Suscripciones
        </h3>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cliente, DNI, plan o método de pago..."
          value={terminoBusqueda}
          onChange={handleBusquedaChange}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Tabla Principal */}
      <div className="p-4 rounded-3 bg-white shadow-sm border">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Nombre de la Persona</th>
              <th>Plan Suscripto</th>
              <th>Método de Pago</th>
              <th>Fecha de Pago</th>
              <th>Monto / Mes</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <TablaSuscripciones
              suscripciones={suscripcionesFiltradas}
              formatearFecha={formatearFecha}
              onVer={handleVer}
            />
          </tbody>
        </table>
      </div>

      {/* Detalle */}
      {mostrarModalVer && suscripcionSeleccionada && (
        <Modal titulo="Detalle de la Suscripción" onClose={() => setMostrarModalVer(false)}>
          <div className="mb-3">
            <h4 className="fw-bold text-dark mb-1">
              {suscripcionSeleccionada.nombre_cliente || 'Cliente desconocido'}
            </h4>
            {suscripcionSeleccionada.dni_cliente && (
              <p className="text-muted small mb-1">
                DNI: <strong>{suscripcionSeleccionada.dni_cliente}</strong>
              </p>
            )}
            <p className="text-muted small mb-2">
              Plan:{' '}
              <strong>
                {suscripcionSeleccionada.plan_nombre || `Plan #${suscripcionSeleccionada.plan_id}`}
              </strong>
            </p>
            <div className="d-flex gap-2 align-items-center mt-2 flex-wrap">
              <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
                {suscripcionSeleccionada.metodo_pago || 'No especificado'}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
                {formatearFecha(suscripcionSeleccionada.fecha_pago)}
              </span>
              <span
                className={`badge bg-${suscripcionSeleccionada.activa ? 'success' : 'secondary'} bg-opacity-25 text-${
                  suscripcionSeleccionada.activa ? 'success' : 'secondary'
                }`}
              >
                {suscripcionSeleccionada.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          <div className="fs-5 fw-bold text-dark text-end mt-3">
            $
            {typeof suscripcionSeleccionada.monto === 'number'
              ? suscripcionSeleccionada.monto.toLocaleString('es-AR')
              : Number(suscripcionSeleccionada.monto || 0).toLocaleString('es-AR')}{' '}
            <span className="fs-6 text-muted">/ mes</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SuscripcionesPagePrivada;