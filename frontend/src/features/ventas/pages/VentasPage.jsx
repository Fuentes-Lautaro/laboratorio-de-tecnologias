import { useState, useEffect } from 'react';
import { getVentas, crearVenta, getVentaPorId } from '../services/ventaService';
import { getProductos } from '../../productos/services/productosServices';
import { TablaVentas } from '../components/TablaVentas';
import { Modal } from '../../../shared/components/Modal';

export function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [clienteDni, setClienteDni] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  // Estado para alertas/notificaciones (igual que en Productos)
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    cargarLista();
  }, []);

  const cargarLista = async () => {
    try {
      const [datosVentas, datosProductos] = await Promise.all([getVentas(), getProductos()]);
      setVentas(datosVentas || []);
      setProductosDisponibles(datosProductos || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      mostrarNotificacion('Error al cargar los datos: ' + err.message, 'danger');
    } finally {
      setCargando(false);
    }
  };

  const mostrarNotificacion = (texto, tipo = 'success') => {
    setAlerta({ texto, tipo });
    setTimeout(() => {
      setAlerta(null);
    }, 3500);
  };

  const ventasFiltradas = ventas.filter((v) => {
    const busqueda = terminoBusqueda.toLowerCase();
    const codigoCoincide = v.codigo?.toLowerCase().includes(busqueda);
    const clienteCoincide = (v.clienteDni || '').toLowerCase().includes(busqueda);
    return codigoCoincide || clienteCoincide;
  });

  const handleVerDetalle = async (venta) => {
    try {
      const codigoVenta = venta.codigo || venta.id;
      const ventaCompleta = await getVentaPorId(codigoVenta);
      setVentaSeleccionada(ventaCompleta);
      setMostrarModalVer(true);
    } catch (err) {
      console.error('Error al obtener detalle:', err);
      mostrarNotificacion('No se pudo cargar el detalle de la venta.', 'danger');
    }
  };

  const handleAgregarItem = (e) => {
    e.preventDefault();
    if (!productoSeleccionadoId) {
      mostrarNotificacion('Por favor, selecciona un producto.', 'danger');
      return;
    }

    const productoEncontrado = productosDisponibles.find(
      p => String(p.p_id || p.id) === String(productoSeleccionadoId)
    );
    if (!productoEncontrado) return;

    const stockDisponible = Number(productoEncontrado.p_stock ?? productoEncontrado.stock ?? 0);
    const cantNum = Number(cantidad) || 1;

    if (cantNum > stockDisponible) {
      mostrarNotificacion(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`, 'danger');
      return;
    }

    const precioNum = Number(productoEncontrado.p_precio ?? productoEncontrado.precio ?? 0);
    const marca = productoEncontrado.p_marca || productoEncontrado.marca || '';
    const varietal = productoEncontrado.p_varietal || productoEncontrado.varietal || '';
    const medida = productoEncontrado.p_medida || productoEncontrado.medida || '';
    const nombreProd = `${marca} ${varietal} (${medida})`.trim() || 'Vino';

    const nuevoItem = {
      productoCodigo: productoEncontrado.p_id || productoEncontrado.id,
      nombre: nombreProd,
      precioUnitario: precioNum,
      cantidad: cantNum,
      subtotal: precioNum * cantNum
    };

    setCarrito([...carrito, nuevoItem]);
    setProductoSeleccionadoId('');
    setCantidad(1);
  };

  const handleQuitarItem = (indexParaQuitar) => {
    setCarrito(carrito.filter((_, index) => index !== indexParaQuitar));
  };

  const totalVenta = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmitVenta = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      mostrarNotificacion('Debe agregar al menos un producto al carrito.', 'danger');
      return;
    }

    // Hora local exacta en formato PostgreSQL TIMESTAMP (YYYY-MM-DD HH:mm:ss)
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const fechaTimestampLocal = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    const nuevaVenta = {
      codigo: `VTA-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: fechaTimestampLocal,
      clienteDni: clienteDni.trim() !== '' ? clienteDni.trim() : null,
      monto: totalVenta,
      metodoPago,
      items: carrito
    };

    try {
      await crearVenta(nuevaVenta);
      const ventasActualizadas = await getVentas();
      setVentas(ventasActualizadas || []);

      setMostrarModalForm(false);
      setCarrito([]);
      setClienteDni('');
      mostrarNotificacion('¡Venta registrada con éxito!', 'success');
    } catch (err) {
      console.error('Error al guardar la venta:', err);
      // Muestra en el cartel de alerta si el DNI del cliente no existe o hubo un error
      mostrarNotificacion(err.message || 'Error al registrar la venta. Verifique los datos.', 'danger');
    }
  };

  if (cargando) return <p className="text-center py-5">Cargando ventas y productos...</p>;
  if (error) return <p className="text-center py-5 text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid py-3">
      {/* Cartel de Alerta (Éxito / Error) idéntico a Productos */}
      {alerta && (
        <div 
          className={`alert alert-${alerta.tipo} alert-dismissible fade show d-flex align-items-center justify-content-between mb-4 shadow-sm rounded-3`} 
          role="alert"
        >
          <div>
            <strong>{alerta.tipo === 'success' ? '✓ ' : '⚠️ '}</strong> {alerta.texto}
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlerta(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Gestión de Ventas</h3>
          <p className="text-muted small mb-0">Listado de transacciones y registro de nuevas ventas.</p>
        </div>
        <button 
          onClick={() => {
            setCarrito([]);
            setClienteDni('');
            setMostrarModalForm(true);
          }} 
          className="btn text-white" 
          style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
        >
          + Nueva Venta
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input 
          type="text"
          className="form-control"
          placeholder="Buscar por código de venta o DNI de cliente..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla Responsiva */}
      <div className="p-3 p-md-4 rounded-3 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="text-muted small text-uppercase">
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Cliente (DNI)</th>
                <th>Empleado (DNI)</th>
                <th>Método de Pago</th>
                <th>Total</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <TablaVentas ventas={ventasFiltradas} onVerDetalle={handleVerDetalle} />
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VER DETALLE */}
      {mostrarModalVer && ventaSeleccionada && (
        <Modal titulo={`Detalle de Venta: ${ventaSeleccionada.codigo}`} onClose={() => setMostrarModalVer(false)}>
          <div className="row mb-3 g-2 small">
            <div className="col-12 col-md-4">
              <strong>Fecha:</strong> {ventaSeleccionada.fecha ? new Date(ventaSeleccionada.fecha).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
            <div className="col-12 col-md-4"><strong>Cliente DNI:</strong> {ventaSeleccionada.clienteDni || 'Consumidor Final'}</div>
            <div className="col-12 col-md-4"><strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago || 'Efectivo'}</div>
          </div>
          
          <h6 className="fw-bold mt-4 mb-2">Productos Comprados:</h6>
          <div className="table-responsive border rounded">
            <table className="table table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-3 py-2">Producto</th>
                  <th className="py-2">Cant.</th>
                  <th className="py-2">P. Unitario</th>
                  <th className="text-end pe-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(!ventaSeleccionada.items || ventaSeleccionada.items.length === 0) ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">No hay productos en esta venta.</td>
                  </tr>
                ) : (
                  ventaSeleccionada.items.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-3 py-2 text-wrap">{item.nombre || 'Vino'}</td>
                      <td className="py-2">{item.cantidad}</td>
                      <td className="py-2">${Number(item.precioUnitario || item.precioU || 0).toLocaleString()}</td>
                      <td className="text-end pe-3 py-2">${Number(item.subtotal || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end align-items-center mt-3">
            <h5 className="fw-bold m-0">Total Final: <span style={{ color: 'var(--titulos, #64141B)' }}>${Number(ventaSeleccionada.monto || ventaSeleccionada.total || 0).toLocaleString()}</span></h5>
          </div>

          <div className="modal-footer px-0 pb-0 mt-3 border-0">
            <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalVer(false)}>Cerrar</button>
          </div>
        </Modal>
      )}

      {/* MODAL NUEVA VENTA */}
      {mostrarModalForm && (
        <Modal titulo="Registrar Nueva Venta" onClose={() => setMostrarModalForm(false)}>
          <form onSubmit={handleSubmitVenta}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">DNI del Cliente (Opcional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: 12345678" 
                  value={clienteDni} 
                  onChange={(e) => setClienteDni(e.target.value)} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Método de Pago</label>
                <select 
                  className="form-select" 
                  value={metodoPago} 
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <hr className="my-3" />
            <h6 className="fw-bold mb-2">Seleccionar Productos del Catálogo</h6>
            
            {/* Sección de Selección Rediseñada y Compacta */}
            <div className="row g-2 align-items-end mb-3 bg-light p-2 rounded border">
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted mb-1">Producto (Vino)</label>
                <select 
                  className="form-select form-select-sm"
                  value={productoSeleccionadoId}
                  onChange={(e) => setProductoSeleccionadoId(e.target.value)}
                >
                  <option value="">Seleccione un vino...</option>
                  {productosDisponibles.map((prod) => {
                    const idProd = prod.p_id || prod.id;
                    const precio = Number(prod.p_precio ?? prod.precio ?? 0);
                    const stock = prod.p_stock ?? prod.stock ?? 0;
                    const marca = prod.p_marca || prod.marca || '';
                    const varietal = prod.p_varietal || prod.varietal || '';
                    const medida = prod.p_medida || prod.medida || '';

                    return (
                      <option key={idProd} value={idProd}>
                        {marca} {varietal} ({medida}) - ${precio.toLocaleString()} [Stock: {stock}]
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-4 col-md-3">
                <label className="form-label small text-muted mb-1">Cantidad</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-control form-control-sm" 
                  value={cantidad} 
                  onChange={(e) => setCantidad(e.target.value)} 
                />
              </div>
              <div className="col-8 col-md-3">
                <button 
                  type="button" 
                  className="btn btn-sm text-white w-100 h-100 shadow-sm d-flex align-items-center justify-content-center" 
                  style={{ backgroundColor: 'var(--detalles, #B5865A)', fontWeight: 500, minHeight: '31px' }}
                  onClick={handleAgregarItem}
                >
                  + Agregar Ítem
                </button>
              </div>
            </div>

            {/* Tabla del Carrito Temporal Estilizada */}
            <div className="table-responsive border rounded mb-3 bg-white">
              <table className="table table-sm mb-0 align-middle">
                <thead className="table-light text-secondary small">
                  <tr>
                    <th className="ps-3 py-2">Producto</th>
                    <th className="py-2 text-center">Cant.</th>
                    <th className="py-2 text-end">P. Unitario</th>
                    <th className="text-end py-2">Subtotal</th>
                    <th className="text-center py-2" style={{ width: '45px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3 small">No hay productos agregados al ticket.</td>
                    </tr>
                  ) : (
                    carrito.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-3 py-2 text-wrap small">{item.nombre}</td>
                        <td className="py-2 text-center small">{item.cantidad}</td>
                        <td className="py-2 text-end small">${Number(item.precioUnitario).toLocaleString()}</td>
                        <td className="text-end py-2 small fw-semibold">${item.subtotal.toLocaleString()}</td>
                        <td className="text-center py-2">
                          <button 
                            type="button" 
                            className="btn btn-sm p-0 text-danger border-0 bg-transparent" 
                            style={{ fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}
                            onClick={() => handleQuitarItem(index)}
                            title="Quitar ítem"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end align-items-center mb-2">
              <h5 className="fw-bold m-0">Total: <span style={{ color: 'var(--titulos, #64141B)' }}>${totalVenta.toLocaleString()}</span></h5>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-light border" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--titulos, #3E100F)' }}>Confirmar Venta</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default VentasPage;