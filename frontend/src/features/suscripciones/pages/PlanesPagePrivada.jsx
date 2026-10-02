import { useState, useEffect } from 'react';
import { getPlanes } from '../services/suscripcionesService';
import TablaPlanes from '../components/TablaPlanes';
import Modal from '../../../shared/components/Modal';

export function PlanesPagePrivada() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  
  const estadoInicialForm = {
    id: '', 
    nombre: '', 
    descripcion: '', 
    cantidad_vinos: 1, 
    valor: 0, 
    productos_proximo_mes: [], 
    activo: true
  };

  const [formData, setFormData] = useState(estadoInicialForm);

  useEffect(() => {
    getPlanes()
      .then(datos => {
        const datosConEstado = datos.map(p => ({ ...p, activo: p.activo ?? true }));
        setPlanes(datosConEstado);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al obtener planes:', err);
        setCargando(false);
      });
  }, []);

  const planesFiltrados = planes.filter((plan) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    const coincideNombre = plan.nombre.toLowerCase().includes(busquedaMinuscula);
    const coincideDescripcion = plan.descripcion.toLowerCase().includes(busquedaMinuscula);
    return coincideNombre || coincideDescripcion;
  });

  const handleNuevo = () => {
    setPlanSeleccionado(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (plan) => {
    setPlanSeleccionado(plan);
    setFormData(plan);
    setMostrarModalForm(true);
  };

  const handleVer = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (plan) => {
    try {
      const planActualizado = { ...plan, activo: !plan.activo };
      setPlanes(planes.map(p => p.id === plan.id ? planActualizado : p));
    } catch (error) {
      console.error('Error al cambiar estado del plan:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (planSeleccionado) {
        setPlanes(planes.map(p => p.id === planSeleccionado.id ? formData : p));
      } else {
        const nuevoPlan = { ...formData, id: Date.now(), activo: true };
        setPlanes([...planes, nuevoPlan]);
      }
    } catch (error) {
      console.error('Error al guardar el plan:', error);
    } finally {
      setMostrarModalForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (cargando) return <p className="text-center py-5">Cargando planes de suscripción...</p>;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Planes de Suscripción</h3>
        <button onClick={handleNuevo} className="btn text-white" style={{ backgroundColor: 'var(--detalles, #B5865A)' }}>
          + Agregar Plan
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar plan por nombre o descripción..." 
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Tabla Principal Modularizada */}
      <div className="p-4 rounded-3 bg-white shadow-sm border">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Nombre del Plan</th>
              <th>Vinos Mensuales</th>
              <th>Valor / Mes</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <TablaPlanes 
              planes={planesFiltrados} 
              onVer={handleVer} 
              onEditar={handleEditar} 
              onToggleEstado={handleToggleEstado} 
            />
          </tbody>
        </table>
      </div>

      {/* Formulario ABM usando el Modal Reutilizable */}
      {mostrarModalForm && (
        <Modal titulo={planSeleccionado ? 'Editar Plan' : 'Nuevo Plan'} onClose={() => setMostrarModalForm(false)}>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small text-muted">Nombre del Plan</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Valor Mensual ($)</label>
              <input type="number" className="form-control" name="valor" value={formData.valor} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Cantidad de Vinos</label>
              <input type="number" className="form-control" name="cantidad_vinos" value={formData.cantidad_vinos} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label small text-muted">Descripción</label>
              <textarea className="form-control" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} required></textarea>
            </div>
            <div className="modal-footer border-0 px-0 pb-0">
              <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--paneles, #3E100F)' }}>Guardar</button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Vista de Detalle usando el Modal Reutilizable */}
      {mostrarModalVer && planSeleccionado && (
        <Modal titulo="Detalle del Plan" onClose={() => setMostrarModalVer(false)}>
          <div className="mb-3">
            <h4 className="fw-bold text-dark mb-1">{planSeleccionado.nombre}</h4>
            <p className="text-muted small">{planSeleccionado.descripcion}</p>
            <div className="d-flex gap-2 align-items-center mt-2">
              <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
                📦 {planSeleccionado.cantidad_vinos} {planSeleccionado.cantidad_vinos === 1 ? 'vino mensual' : 'vinos mensuales'}
              </span>
              <span className={`badge bg-${planSeleccionado.activo ? 'success' : 'secondary'} bg-opacity-25 text-${planSeleccionado.activo ? 'success' : 'secondary'}`}>
                {planSeleccionado.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <div className="fs-5 fw-bold text-dark text-end mt-3">
            ${typeof planSeleccionado.valor === 'number' ? planSeleccionado.valor.toLocaleString('es-AR') : planSeleccionado.valor} <span className="fs-6 text-muted">/ mes</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PlanesPagePrivada;