import { useState, useEffect } from 'react';
import { getPlanes, getRegistrosMes } from '../services/suscripcionesService';
import { getProductos } from '../../productos';
import TablaPlanes from '../components/TablaPlanesPrivada';
import Modal from '../../../shared/components/Modal';

export function PlanesPagePrivada() {
  const [planes, setPlanes] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estados de Modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  
  // Estado para la gestión de RegistroMes en la vista de Ver
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');

  // Estado para el formulario (Ahora manejamos un array de productos seleccionados)
  const estadoInicialForm = {
    id: '', 
    nombre: '', 
    descripcion: '', 
    cantidad_vinos: 1, 
    valor: 0, 
    activo: true,
    nuevo_periodo: '',
    productos_seleccionados: [] // Array para múltiples vinos
  };

  const [formData, setFormData] = useState(estadoInicialForm);
  const [productoTemp, setProductoTemp] = useState(''); // Producto seleccionado temporalmente en el select

  // Carga inicial de datos
  useEffect(() => {
    Promise.all([getPlanes(), getRegistrosMes(), getProductos()])
      .then(([datosPlanes, datosRegistros, datosProductos]) => {
        const datosConEstado = datosPlanes.map(p => ({ ...p, activo: p.activo ?? true }));
        setPlanes(datosConEstado);
        setRegistros(datosRegistros || []);
        setProductosDisponibles(datosProductos || []);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al obtener datos iniciales:', err);
        setCargando(false);
      });
  }, []);

  const planesFiltrados = planes.filter((plan) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    return plan.nombre.toLowerCase().includes(busquedaMinuscula) || plan.descripcion.toLowerCase().includes(busquedaMinuscula);
  });

  const handleNuevo = () => {
    setPlanSeleccionado(null);
    setFormData(estadoInicialForm);
    setProductoTemp('');
    setMostrarModalForm(true);
  };

  const handleEditar = (plan) => {
    setPlanSeleccionado(plan);
    setFormData({
      ...plan,
      nuevo_periodo: '',
      productos_seleccionados: []
    });
    setProductoTemp('');
    setMostrarModalForm(true);
  };

  const handleVer = (plan) => {
    setPlanSeleccionado(plan);
    
    const registrosDelPlan = registros.filter(r => r.plan_id === plan.id);
    if (registrosDelPlan.length > 0) {
      const registrosOrdenados = registrosDelPlan.sort((a, b) => b.periodo.localeCompare(a.periodo));
      setPeriodoSeleccionado(registrosOrdenados[0].periodo);
    } else {
      setPeriodoSeleccionado('');
    }
    
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (plan) => {
    const planActualizado = { ...plan, activo: !plan.activo };
    setPlanes(planes.map(p => p.id === plan.id ? planActualizado : p));
  };

  // Funciones para manejar la lista dinámica de vinos en el formulario
  const handleAgregarVinoTemporal = () => {
    if (!productoTemp) return;
    // Evitamos duplicados si se desea, o permitimos repetidos según la lógica de la bodega
    if (!formData.productos_seleccionados.includes(productoTemp)) {
      setFormData({
        ...formData,
        productos_seleccionados: [...formData.productos_seleccionados, productoTemp]
      });
      setProductoTemp(''); // Reseteamos el select temporal
    }
  };

  const handleQuitarVinoTemporal = (idProducto) => {
    setFormData({
      ...formData,
      productos_seleccionados: formData.productos_seleccionados.filter(id => id !== idProducto)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (planSeleccionado) {
      // Editar plan existente
      setPlanes(planes.map(p => p.id === planSeleccionado.id ? {
        id: formData.id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cantidad_vinos: formData.cantidad_vinos,
        valor: formData.valor,
        activo: formData.activo
      } : p));

      // Si completó período y añadió vinos en la lista
      if (formData.nuevo_periodo && formData.productos_seleccionados.length > 0) {
        const nuevoRegistro = {
          id: Date.now(),
          plan_id: planSeleccionado.id,
          periodo: formData.nuevo_periodo,
          productos: formData.productos_seleccionados
        };
        setRegistros([...registros, nuevoRegistro]);
      }
    } else {
      // Crear nuevo plan
      const nuevoId = Date.now();
      const nuevoPlan = { 
        id: nuevoId, 
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cantidad_vinos: formData.cantidad_vinos,
        valor: formData.valor,
        activo: true 
      };
      setPlanes([...planes, nuevoPlan]);

      if (formData.nuevo_periodo && formData.productos_seleccionados.length > 0) {
        const nuevoRegistro = {
          id: Date.now() + 1,
          plan_id: nuevoId,
          periodo: formData.nuevo_periodo,
          productos: formData.productos_seleccionados
        };
        setRegistros([...registros, nuevoRegistro]);
      }
    }
    
    setMostrarModalForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (cargando) return <p className="text-center py-5">Cargando planes de suscripción...</p>;

  const registrosPlanActual = planSeleccionado 
    ? registros.filter(r => r.plan_id === planSeleccionado.id).sort((a, b) => b.periodo.localeCompare(a.periodo)) 
    : [];
  const registroViendo = registrosPlanActual.find(r => r.periodo === periodoSeleccionado);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Planes de Suscripción</h3>
        <button onClick={handleNuevo} className="btn text-white" style={{ backgroundColor: 'var(--detalles, #B5865A)' }}>
          + Agregar Plan
        </button>
      </div>

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
            <TablaPlanes planes={planesFiltrados} onVer={handleVer} onEditar={handleEditar} onToggleEstado={handleToggleEstado} />
          </tbody>
        </table>
      </div>

      {/* Formulario ABM */}
      {mostrarModalForm && (
        <Modal titulo={planSeleccionado ? 'Editar Plan y Productos' : 'Nuevo Plan'} onClose={() => setMostrarModalForm(false)}>
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
              <label className="form-label small text-muted">Cantidad de Vinos Requerida</label>
              <input type="number" className="form-control" name="cantidad_vinos" value={formData.cantidad_vinos} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label small text-muted">Descripción</label>
              <textarea className="form-control" name="descripcion" rows="2" value={formData.descripcion} onChange={handleChange} required></textarea>
            </div>

            <hr className="my-2" />
            <h6 className="fw-bold text-muted mb-0">Planificar Productos para un Mes</h6>

            <div className="col-md-12">
              <label className="form-label small">Período (YYYY-MM)</label>
              <input type="month" className="form-control" name="nuevo_periodo" value={formData.nuevo_periodo} onChange={handleChange} />
            </div>
            
            <div className="col-md-8">
              <label className="form-label small">Seleccionar Vino</label>
              <select 
                className="form-select" 
                value={productoTemp} 
                onChange={(e) => setProductoTemp(e.target.value)}
              >
                <option value="">Selecciona un vino del catálogo...</option>
                {productosDisponibles.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.marca} - {prod.tipo} - {prod.varietal} - {prod.bodega} - {prod.medida}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button 
                type="button" 
                className="btn btn-secondary w-100" 
                onClick={handleAgregarVinoTemporal}
              >
                + Añadir Vino
              </button>
            </div>

            {/* Listado de vinos seleccionados para este período */}
            <div className="col-12 mt-2">
              <label className="form-label small fw-semibold">
                Vinos seleccionados ({formData.productos_seleccion_count || formData.productos_seleccionados.length} / {formData.cantidad_vinos}):
              </label>
              <ul className="list-group border p-2 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {formData.productos_seleccionados.length > 0 ? (
                  formData.productos_seleccionados.map((idProd) => {
                    const prodInfo = productosDisponibles.find(p => p.id == idProd);
                    return (
                      <li key={idProd} className="list-group-item d-flex justify-content-between align-items-center py-1 bg-transparent border-0">
                        <span>🍷 {prodInfo ? `${prodInfo.marca} - ${prodInfo.tipo} - ${prodInfo.varietal} - ${prodInfo.bodega} - ${prodInfo.medida}` : idProd}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm text-danger p-0 fw-bold" 
                          onClick={() => handleQuitarVinoTemporal(idProd)}
                        >
                          ✕ Quitar
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-muted small text-center py-1">No hay vinos agregados todavía para este mes.</li>
                )}
              </ul>
            </div>

            <div className="modal-footer border-0 px-0 pb-0">
              <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--paneles, #3E100F)' }}>Guardar</button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Detalle */}
      {mostrarModalVer && planSeleccionado && (
        <Modal titulo="Historial de Productos por Mes" onClose={() => setMostrarModalVer(false)}>
          <div className="mb-3">
            <h4 className="fw-bold text-dark mb-1">{planSeleccionado.nombre}</h4>
            <p className="text-muted small mb-2">{planSeleccionado.descripcion}</p>
            <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
              📦 {planSeleccionado.cantidad_vinos} vinos mensuales
            </span>
          </div>

          <hr />

          <div>
            <h6 className="fw-bold mb-3 text-muted">Consultar Mes</h6>
            {registrosPlanActual.length > 0 ? (
              <>
                <select 
                  className="form-select mb-3" 
                  value={periodoSeleccionado} 
                  onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                >
                  {registrosPlanActual.map(r => (
                    <option key={r.id} value={r.periodo}>Mes: {r.periodo}</option>
                  ))}
                </select>
                
                {registroViendo && (
                  <ul className="list-group list-group-flush border rounded p-2 bg-light">
                    {registroViendo.productos.map((prodId, idx) => {
                      const prodInfo = productosDisponibles.find(p => p.id == prodId);
                      return (
                        <li key={idx} className="list-group-item bg-transparent border-0 py-1 text-dark">
                          🍷 {prodInfo ? `${prodInfo.marca} - ${prodInfo.tipo} - ${prodInfo.varietal} - ${prodInfo.bodega} - ${prodInfo.medida}` : prodId}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-muted small">No hay registros cargados para este plan.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PlanesPagePrivada;