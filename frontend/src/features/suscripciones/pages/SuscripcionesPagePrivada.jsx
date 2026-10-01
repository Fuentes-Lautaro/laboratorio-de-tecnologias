import { useState, useEffect } from 'react';
import { getSuscripciones } from '../services/suscripcionesService';
import { getClientes } from '../../clientes';
import { getPlanes } from '../services/suscripcionesService';

export function SuscripcionesPagePrivada() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState(null);
  
  const estadoInicialForm = {
    id: '', 
    dni_cliente: '', 
    plan_id: '', 
    metodo_pago: '', 
    fecha_pago: new Date().toISOString().split('T')[0], 
    monto: 0, 
    activa: true
  };

  const [formData, setFormData] = useState(estadoInicialForm);

  // Criterio de vigencia: si pagó este mes o el mes inmediatamente anterior, se considera activa
  const evaluarEstadoSuscripcion = (suscripcion) => {
    if (!suscripcion.fecha_pago) return suscripcion.activa;

    const fechaPago = new Date(suscripcion.fecha_pago);
    const fechaActual = new Date(); // Octubre 2026

    const anioPago = fechaPago.getFullYear();
    const mesPago = fechaPago.getMonth(); // 0-11

    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth(); // 0-11

    const totalMesesPago = anioPago * 12 + mesPago;
    const totalMesesActual = anioActual * 12 + mesActual;

    const diferenciaMeses = totalMesesActual - totalMesesPago;

    if (diferenciaMeses === 0 || diferenciaMeses === 1) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [datosSuscripciones, datosClientes, datosPlanes] = await Promise.all([
          getSuscripciones(),
          getClientes(),
          getPlanes()
        ]);
        
        const suscripcionesProcesadas = datosSuscripciones.map(s => ({ 
          ...s, 
          activa: evaluarEstadoSuscripcion(s) 
        }));

        setSuscripciones(suscripcionesProcesadas);
        setClientes(datosClientes);
        setPlanes(datosPlanes);
        setCargando(false);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const obtenerNombreCliente = (dni) => {
    const cliente = clientes.find(c => c.dni === dni);
    return cliente ? cliente.nombre : 'Cliente desconocido';
  };

  const obtenerNombrePlan = (planId) => {
    const plan = planes.find(p => p.id === Number(planId));
    return plan ? plan.nombre : 'Plan desconocido';
  };

  // Filtrado y ordenamiento: primero las activas (true), luego las inactivas (false)
  const suscripcionesFiltradas = suscripciones
    .filter((suscripcion) => {
      const busquedaMinuscula = terminoBusqueda.toLowerCase();
      const nombreCliente = obtenerNombreCliente(suscripcion.dni_cliente).toLowerCase();
      const nombrePlan = obtenerNombrePlan(suscripcion.plan_id).toLowerCase();
      const metodoPago = (suscripcion.metodo_pago || '').toLowerCase();

      return (
        nombreCliente.includes(busquedaMinuscula) ||
        nombrePlan.includes(busquedaMinuscula) ||
        metodoPago.includes(busquedaMinuscula)
      );
    })
    .sort((a, b) => {
      // Ordena de forma que las activas (true / 1) queden arriba de las inactivas (false / 0)
      return (b.activa === true) - (a.activa === true);
    });

  const handleNuevo = () => {
    setSuscripcionSeleccionada(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    setFormData(suscripcion);
    setMostrarModalForm(true);
  };

  const handleVer = (suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (suscripcion) => {
    try {
      const suscripcionActualizada = { ...suscripcion, activa: !suscripcion.activa };
      setSuscripciones(suscripciones.map(s => s.id === suscripcion.id ? suscripcionActualizada : s));
    } catch (error) {
      console.error('Error al cambiar estado de la suscripción:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (suscripcionSeleccionada) {
        setSuscripciones(suscripciones.map(s => s.id === suscripcionSeleccionada.id ? formData : s));
      } else {
        const nuevaSuscripcion = { ...formData, id: Date.now(), activa: true };
        setSuscripciones([...suscripciones, nuevaSuscripcion]);
      }
    } catch (error) {
      console.error('Error al guardar la suscripción:', error);
    } finally {
      setMostrarModalForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBusquedaChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  if (cargando) return <p className="text-center py-5">Cargando suscripciones...</p>;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Suscripciones</h3>
        <button onClick={handleNuevo} className="btn text-white" style={{ backgroundColor: 'var(--detalles, #B5865A)' }}>
          + Agregar Suscripción
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar por cliente, plan o método de pago..." 
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
            {suscripcionesFiltradas.length > 0 ? (
              suscripcionesFiltradas.map(suscripcion => (
                <tr key={suscripcion.id} style={{ opacity: suscripcion.activa ? 1 : 0.6 }}>
                  <td className="fw-semibold">{obtenerNombreCliente(suscripcion.dni_cliente)}</td>
                  <td>🍷 {obtenerNombrePlan(suscripcion.plan_id)}</td>
                  <td>💳 {suscripcion.metodo_pago}</td>
                  <td>📅 {suscripcion.fecha_pago}</td>
                  <td>${typeof suscripcion.monto === 'number' ? suscripcion.monto.toLocaleString('es-AR') : suscripcion.monto}</td>
                  <td>
                    <span className={`badge bg-${suscripcion.activa ? 'success' : 'secondary'} bg-opacity-25 text-${suscripcion.activa ? 'success' : 'secondary'}`}>
                      {suscripcion.activa ? 'Activa' : 'Inactiva (Sin renovar)'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        onClick={() => handleVer(suscripcion)} 
                        className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                        style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
                      >
                        👁️ Ver
                      </button>
                      
                      <button 
                        onClick={() => handleEditar(suscripcion)} 
                        className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                        style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
                      >
                        ✏️ Editar
                      </button>

                      <button 
                        onClick={() => handleToggleEstado(suscripcion)} 
                        className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${suscripcion.activa ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {suscripcion.activa ? '🚫 Baja' : '✅ Alta'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No se encontraron suscripciones con "{terminoBusqueda}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario ABM (Modal) */}
      {mostrarModalForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{suscripcionSeleccionada ? 'Editar Suscripción' : 'Nueva Suscripción'}</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalForm(false)}></button>
              </div>
              <div className="modal-body p-4 row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Cliente</label>
                  <select className="form-select" name="dni_cliente" value={formData.dni_cliente} onChange={handleChange} required>
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map(c => (
                      <option key={c.dni} value={c.dni}>{c.nombre} (DNI: {c.dni})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Plan</label>
                  <select className="form-select" name="plan_id" value={formData.plan_id} onChange={handleChange} required>
                    <option value="">Seleccione un plan...</option>
                    {planes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} (${p.valor?.toLocaleString('es-AR')})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Método de Pago</label>
                  <input type="text" className="form-control" name="metodo_pago" value={formData.metodo_pago} onChange={handleChange} placeholder="Ej: Tarjeta de Crédito, Mercado Pago" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Fecha de Pago</label>
                  <input type="date" className="form-control" name="fecha_pago" value={formData.fecha_pago} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Monto Mensual ($)</label>
                  <input type="number" className="form-control" name="monto" value={formData.monto} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
                <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--paneles, #3E100F)' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Vista de Tarjeta / Detalle (Modal Ver) */}
      {mostrarModalVer && suscripcionSeleccionada && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="card border-0">
                <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--titulos, #3E100F)' }}>
                  <h5 className="mb-0 fw-bold">Detalle de la Suscripción</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalVer(false)}></button>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h4 className="fw-bold text-dark mb-1">{obtenerNombreCliente(suscripcionSeleccionada.dni_cliente)}</h4>
                    <p className="text-muted small mb-2">Plan: <strong>{obtenerNombrePlan(suscripcionSeleccionada.plan_id)}</strong></p>
                    <div className="d-flex gap-2 align-items-center mt-2 flex-wrap">
                      <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
                        💳 {suscripcionSeleccionada.metodo_pago}
                      </span>
                      <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
                        📅 {suscripcionSeleccionada.fecha_pago}
                      </span>
                      <span className={`badge bg-${suscripcionSeleccionada.activa ? 'success' : 'secondary'} bg-opacity-25 text-${suscripcionSeleccionada.activa ? 'success' : 'secondary'}`}>
                        {suscripcionSeleccionada.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  <div className="fs-5 fw-bold text-dark text-end mt-3">
                    ${typeof suscripcionSeleccionada.monto === 'number' ? suscripcionSeleccionada.monto.toLocaleString('es-AR') : suscripcionSeleccionada.monto} <span className="fs-6 text-muted">/ mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuscripcionesPagePrivada;