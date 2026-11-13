import { useState, useEffect } from 'react';
import { getPlanes, getProductosParaPlanes, crearPlan, modificarPlan, alternarEstadoPlan, guardarRegistroMes } from '../services/suscripcionesService';
import TablaPlanes from '../components/TablaPlanesPrivada';
import Modal from '../../../shared/components/Modal';

export function PlanesPagePrivada() {
  const [planes, setPlanes] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [terminoBusquedaVino, setTerminoBusquedaVino] = useState('');
  const [errorForm, setErrorForm] = useState('');
  
  // Estados de Modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [mostrarModalSeleccionVinos, setMostrarModalSeleccionVinos] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const estadoInicialForm = {
    id: '', 
    nombre: '', 
    descripcion: '', 
    cantidad_vinos: 1, 
    valor: 0, 
    activo: true,
    nuevo_periodo: '',
    productos_seleccionados: []
  };

  const [formData, setFormData] = useState(estadoInicialForm);

  // Carga inicial usando el servicio
  useEffect(() => {
    Promise.all([
      getPlanes(), 
      getProductosParaPlanes()
    ])
      .then(([datosPlanes, datosProductos]) => {
        setPlanes(datosPlanes || []);
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
    const nombre = plan.nombre || '';
    const descripcion = plan.descripcion || '';
    return nombre.toLowerCase().includes(busquedaMinuscula) || descripcion.toLowerCase().includes(busquedaMinuscula);
  });

  const handleNuevo = () => {
    setPlanSeleccionado(null);
    setErrorForm('');
    setTerminoBusquedaVino('');
    const hoy = new Date();
    const proximoMesDate = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
    const periodoPorDefecto = `${proximoMesDate.getFullYear()}-${String(proximoMesDate.getMonth() + 1).padStart(2, '0')}`;

    setFormData({
      ...estadoInicialForm,
      nuevo_periodo: periodoPorDefecto
    });
    setMostrarModalForm(true);
  };

  const handleEditar = (plan) => {
    setPlanSeleccionado(plan);
    setErrorForm('');
    setTerminoBusquedaVino('');
    
    const productosPrecargados = plan.productos_proximo_mes ? plan.productos_proximo_mes.map(p => p.id || p.p_id) : [];

    const hoy = new Date();
    const proximoMesDate = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
    const periodoPorDefecto = `${proximoMesDate.getFullYear()}-${String(proximoMesDate.getMonth() + 1).padStart(2, '0')}`;

    setFormData({
      ...plan,
      nuevo_periodo: periodoPorDefecto,
      productos_seleccionados: productosPrecargados
    });
    setMostrarModalForm(true);
  };

  const handleVer = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (plan) => {
    try {
      await alternarEstadoPlan(plan.id);
      setPlanes(planes.map(p => p.id === plan.id ? { ...p, activo: !p.activo } : p));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  // Función para agregar un producto desde la tabla amplia
  const handleAgregarVinoModal = (idProd) => {
    const cantidadRequerida = Number(formData.cantidad_vinos) || 1;
    
    if (formData.productos_seleccionados.length >= cantidadRequerida) {
      setErrorForm(`No se pueden agregar más productos. El plan exige un máximo y exacto de ${cantidadRequerida} unidades.`);
      return;
    }

    setErrorForm('');
    const prodIdNum = Number(idProd);
    setFormData({
      ...formData,
      productos_seleccionados: [...formData.productos_seleccionados, prodIdNum]
    });
  };

  // Función para quitar una unidad de un producto específico desde la tabla amplia
  const handleQuitarVinoModal = (idProd) => {
    setErrorForm('');
    const prodIdNum = Number(idProd);
    const index = formData.productos_seleccionados.lastIndexOf(prodIdNum);
    if (index !== -1) {
      const nuevaSeleccion = [...formData.productos_seleccionados];
      nuevaSeleccion.splice(index, 1);
      setFormData({
        ...formData,
        productos_seleccionados: nuevaSeleccion
      });
    }
  };

  const handleQuitarVinoTemporal = (indexToRemove) => {
    setErrorForm('');
    setFormData({
      ...formData,
      productos_seleccionados: formData.productos_seleccionados.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    const cantidadRequerida = Number(formData.cantidad_vinos);
    const cantidadSeleccionada = formData.productos_seleccionados.length;

    if (cantidadSeleccionada !== cantidadRequerida) {
      setErrorForm(`Este plan exige exactamente ${cantidadRequerida} vinos. Actualmente tenés seleccionados ${cantidadSeleccionada}.`);
      return;
    }

    try {
      const payloadPlan = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cantidadVinos: cantidadRequerida,
        valor: Number(formData.valor)
      };

      let planIdActual;

      if (planSeleccionado) {
        await modificarPlan(planSeleccionado.id, payloadPlan);
        planIdActual = planSeleccionado.id;
      } else {
        const nuevoPlan = await crearPlan(payloadPlan);
        planIdActual = nuevoPlan.id || nuevoPlan.ps_id;
      }

      if (formData.nuevo_periodo && formData.productos_seleccionados.length > 0) {
        await guardarRegistroMes(planIdActual, formData.nuevo_periodo, formData.productos_seleccionados);
      }

      setMostrarModalForm(false);
      window.location.reload();

    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorForm("Hubo un error al intentar guardar los cambios en el servidor.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (cargando) return <p className="text-center py-5">Cargando planes de suscripción...</p>;

  const productosOrdenados = [...productosDisponibles]
    .filter((prod) => {
      const nombreVino = (prod.nombre || prod.p_marca || prod.marca || '').toLowerCase();
      const detalleVino = (prod.varietal || prod.p_varietal || prod.medida || '').toLowerCase();
      const busq = terminoBusquedaVino.toLowerCase();
      return nombreVino.includes(busq) || detalleVino.includes(busq);
    })
    .sort((a, b) => {
      const stockA = a.stock ?? a.p_stock ?? a.p_cantidad ?? 0;
      const stockB = b.stock ?? b.p_stock ?? b.p_cantidad ?? 0;
      return stockB - stockA;
    });

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

      {/* Formulario ABM principal */}
      {mostrarModalForm && (
        <Modal titulo={planSeleccionado ? 'Editar Plan y Productos' : 'Nuevo Plan'} onClose={() => setMostrarModalForm(false)}>
          <form onSubmit={handleSubmit} className="row g-3">
            
            {errorForm && (
              <div className="col-12">
                <div className="alert alert-danger py-2 px-3 small mb-0 d-flex align-items-center" role="alert">
                  <span>{errorForm}</span>
                </div>
              </div>
            )}

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
              <input 
                type="number" 
                className="form-control" 
                name="cantidad_vinos" 
                value={formData.cantidad_vinos} 
                min="1" 
                onChange={(e) => {
                  handleChange(e);
                  setErrorForm('');
                }} 
                required 
              />
            </div>
            <div className="col-12">
              <label className="form-label small text-muted">Descripción</label>
              <textarea className="form-control" name="descripcion" rows="2" value={formData.descripcion} onChange={handleChange} required></textarea>
            </div>

            <hr className="my-2" />
            <h6 className="fw-bold text-muted mb-0">Planificar Productos para un Mes</h6>

            <div className="col-md-12">
              <label className="form-label small">Período (YYYY-MM)</label>
              <input type="month" className="form-control" name="nuevo_periodo" value={formData.nuevo_periodo} onChange={handleChange} required />
            </div>

            {/* Botón para abrir la ventana emergente amplia */}
            <div className="col-12 d-flex justify-content-between align-items-center bg-light p-3 rounded border">
              <div>
                <span className="small fw-semibold d-block text-dark">
                  Productos seleccionados: {formData.productos_seleccionados.length} / {formData.cantidad_vinos}
                </span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {formData.productos_seleccionados.length === Number(formData.cantidad_vinos) 
                    ? '✓ Cupo completo' 
                    : 'Faltan productos por seleccionar'}
                </span>
              </div>
              <button 
                type="button" 
                className="btn btn-sm text-white px-3" 
                style={{ backgroundColor: '#B5865A' }}
                onClick={() => setMostrarModalSeleccionVinos(true)}
              >
                Abrir Catalogo
              </button>
            </div>

            {/* Listado resumido de vinos seleccionados */}
            <div className="col-12 mt-1">
              <ul className="list-group border p-2 bg-light" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {formData.productos_seleccionados.length > 0 ? (
                  formData.productos_seleccionados.map((idProd, index) => {
                    const prodInfo = productosDisponibles.find(p => String(p.id || p.p_id) === String(idProd));
                    const nombreVino = prodInfo ? (prodInfo.nombre || prodInfo.p_marca || prodInfo.marca || `Producto #${idProd}`) : `ID: ${idProd}`;
                    const detalleVino = prodInfo ? (prodInfo.varietal || prodInfo.p_varietal || '') : '';

                    return (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-1 bg-transparent border-0">
                        <span className="small"><strong>{nombreVino}</strong> {detalleVino ? `- ${detalleVino}` : ''}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm text-danger p-0 fw-bold shadow-none" 
                          onClick={() => handleQuitarVinoTemporal(index)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          ✕ Quitar
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-muted small text-center py-1">Ningún producto seleccionado todavía. Hacé clic en "Abrir Catalogo ".</li>
                )}
              </ul>
            </div>

            <div className="modal-footer border-0 px-0 pb-0">
              <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: '#3E100F' }}>Guardar Plan</button>
            </div>
          </form>
        </Modal>
      )}

      {/* 🗔 VENTANA EMERGENTE AMPLIA PARA SELECCIONAR PRODUCTOS */}
      {mostrarModalSeleccionVinos && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-white text-dark border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold" style={{ color: '#3E100F' }}>Catalogo de Vinos</h5>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={() => setMostrarModalSeleccionVinos(false)}
                ></button>
              </div>

              <div className="modal-body p-4 bg-light">
                <div className="row mb-3 align-items-center">
                  <div className="col-md-6">
                    <span className="small text-muted">
                      Seleccionados: <strong>{formData.productos_seleccionados.length}</strong> de <strong>{formData.cantidad_vinos}</strong> requeridos.
                    </span>
                  </div>
                  <div className="col-md-6 text-md-end mt-2 mt-md-0">
                    <input 
                      type="text" 
                      className="form-control form-control-sm d-inline-block w-auto" 
                      placeholder="Buscar por marca, varietal o nombre..." 
                      value={terminoBusquedaVino}
                      onChange={(e) => setTerminoBusquedaVino(e.target.value)}
                      style={{ minWidth: '280px' }}
                    />
                  </div>
                </div>

                <div className="border rounded bg-white shadow-sm overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th className="ps-3">ID</th>
                        <th>Nombre / Marca</th>
                        <th>Varietal</th>
                        <th>Medida</th>
                        <th className="text-center">Stock Disponible</th>
                        <th className="text-center">Cantidad en el Plan</th>
                        <th className="text-end pe-3">Acciones rápidas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosOrdenados.length > 0 ? (
                        productosOrdenados.map((prod) => {
                          const idProd = prod.id || prod.p_id;
                          const stockProd = prod.stock ?? prod.p_stock ?? prod.p_cantidad ?? 0;
                          const sinStock = stockProd <= 0;
                          const nombreVino = prod.nombre || prod.p_marca || prod.marca || `Producto #${idProd}`;
                          const detalleVarietal = prod.varietal || prod.p_varietal || '-';
                          const detalleMedida = prod.medida || prod.p_medida || '-';
                          
                          // Contar cuántas veces está agregado este producto en el plan actual
                          const cantidadAsignada = formData.productos_seleccionados.filter(id => Number(id) === Number(idProd)).length;
                          const cupoAlcanzado = formData.productos_seleccionados.length >= Number(formData.cantidad_vinos);

                          return (
                            <tr key={idProd} className={sinStock ? 'text-muted bg-secondary bg-opacity-10' : ''}>
                              <td className="ps-3 small text-muted">#{idProd}</td>
                              <td className="fw-semibold small text-dark">{nombreVino}</td>
                              <td className="small text-secondary">{detalleVarietal}</td>
                              <td className="small text-secondary">{detalleMedida}</td>
                              <td className="text-center">
                                <span className={`badge ${stockProd > 5 ? 'bg-success' : stockProd > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                  {stockProd} un.
                                </span>
                              </td>
                              <td className="text-center fw-bold small text-dark">
                                {cantidadAsignada}
                              </td>
                              <td className="text-end pe-3">
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    type="button" 
                                    className="btn btn-outline-danger px-2" 
                                    disabled={cantidadAsignada <= 0}
                                    onClick={() => handleQuitarVinoModal(idProd)}
                                    title="Quitar una unidad"
                                  >
                                    -
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn text-white px-3" 
                                    style={{ backgroundColor: '#3E100F' }}
                                    disabled={sinStock || cupoAlcanzado}
                                    onClick={() => handleAgregarVinoModal(idProd)}
                                    title="Agregar una unidad"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center text-muted small py-4">No se encontraron productos registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer bg-white border-top px-4 py-3">
                <button 
                  type="button" 
                  className="btn text-white px-5" 
                  style={{ backgroundColor: '#3E100F' }} 
                  onClick={() => setMostrarModalSeleccionVinos(false)}
                >
                  Listo / Guardar Selección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Detalle al hacer click en Ver */}
      {mostrarModalVer && planSeleccionado && (
        <Modal titulo="Historial de Productos por Mes" onClose={() => setMostrarModalVer(false)}>
          <div className="mb-3">
            <h4 className="fw-bold text-dark mb-1">{planSeleccionado.nombre}</h4>
            <p className="text-muted small mb-2">{planSeleccionado.descripcion}</p>
            <span className="badge bg-secondary bg-opacity-25 text-dark fw-semibold">
              {planSeleccionado.cantidad_vinos} unidades mensuales
            </span>
          </div>

          <hr />

          <div>
            <h6 className="fw-bold mb-3 text-muted">Productos Registrados</h6>
            {planSeleccionado.productos_proximo_mes && planSeleccionado.productos_proximo_mes.length > 0 ? (
              <ul className="list-group list-group-flush border rounded p-2 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {planSeleccionado.productos_proximo_mes.map((vino, idx) => (
                  <li key={idx} className="list-group-item bg-transparent border-bottom py-2 text-dark small">
                    <strong>{vino.marca || vino.nombre}</strong> - {vino.varietal} ({vino.medida})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small">No hay productos asignados para este plan en el período actual.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PlanesPagePrivada;