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
  const [empleadoDni, setEmpleadoDni] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    Promise.all([getVentas(), getProductos()])
      .then(([datosVentas, datosProductos]) => {
        setVentas(datosVentas);
        setProductosDisponibles(datosProductos || []);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message || 'Error al cargar los datos');
        setCargando(false);
      });
  }, []);

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
      alert('No se pudo cargar el detalle de la venta.');
    }
  };

  const handleAgregarItem = (e) => {
    e.preventDefault();
    if (!productoSeleccionadoId) return;

    // Buscamos contemplando tanto si viene con prefijo p_ como si viene mapeado
    const productoEncontrado = productosDisponibles.find(
      p => String(p.p_id || p.id) === String(productoSeleccionadoId)
    );
    if (!productoEncontrado) return;

    const precioNum = Number(productoEncontrado.p_precio ?? productoEncontrado.precio ?? 0);
    const cantNum = Number(cantidad) || 1;

    // Armamos el nombre amigable del vino usando tus columnas de base de datos
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

  const totalVenta = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmitVenta = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('Debe agregar al menos un producto al carrito.');
      return;
    }

    const nuevaVenta = {
      codigo: `VTA-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString().split('T')[0],
      clienteDni: clienteDni || null,
      empleadoDni: empleadoDni || 'Sin asignar',
      monto: totalVenta,
      metodoPago,
      items: carrito
    };

    try {
      const guardada = await crearVenta(nuevaVenta);
      setVentas([guardada, ...ventas]);
      setMostrarModalForm(false);
      setCarrito([]);
      setClienteDni('');
      setEmpleadoDni('');
    } catch (err) {
      console.error('Error al guardar la venta:', err);
      alert('Error al registrar la venta en el servidor.');
    }
  };

  if (cargando) return <p className="text-center py-5">Cargando ventas y productos...</p>;
  if (error) return <p className="text-center py-5 text-danger">Error: {error}</p>;

  return (
    <div className="p-3 p-md-4 container-fluid">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Gestión de Ventas</h3>
          <p className="text-muted small mb-0">Listado de transacciones y registro de nuevas ventas.</p>
        </div>
        <button 
          onClick={() => setMostrarModalForm(true)} 
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
            <div className="col-12 col-md-4"><strong>Fecha:</strong> {ventaSeleccionada.fecha?.split('T')[0]}</div>
            <div className="col-12 col-md-4"><strong>Cliente DNI:</strong> {ventaSeleccionada.clienteDni || 'Consumidor Final'}</div>
            <div className="col-12 col-md-4"><strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago || 'Efectivo'}</div>
          </div>
          
          <h6 className="fw-bold mt-4 mb-2">Productos Comprados:</h6>
          <div className="table-responsive border rounded">
            <table className="table table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-2">Producto</th>
                  <th>Cant.</th>
                  <th>P. Unitario</th>
                  <th className="text-end pe-2">Subtotal</th>
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
                      <td className="ps-2 text-wrap">{item.nombre || 'Vino'}</td>
                      <td>{item.cantidad}</td>
                      <td>${Number(item.precioUnitario || item.precioU || 0).toLocaleString()}</td>
                      <td className="text-end pe-2">${Number(item.subtotal || 0).toLocaleString()}</td>
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
                  placeholder="Ej: 87654321" 
                  value={clienteDni} 
                  onChange={(e) => setClienteDni(e.target.value)} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">DNI del Empleado</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: 31987654" 
                  value={empleadoDni} 
                  onChange={(e) => setEmpleadoDni(e.target.value)} 
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

            <hr />
            <h6 className="fw-bold mb-3">Seleccionar Productos del Catálogo</h6>
            
            {/* Selector de productos y botón + Item ordenados */}
            <div className="row g-2 align-items-end mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">Producto (Vino)</label>
                <select 
                  className="form-select"
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
                        {marca} {varietal} - ${precio.toLocaleString()} [Stock: {stock}]
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small text-muted">Cantidad</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-control" 
                  value={cantidad} 
                  onChange={(e) => setCantidad(e.target.value)} 
                />
              </div>
              <div className="col-6 col-md-3">
                <button type="button" className="btn btn-outline-dark w-100" onClick={handleAgregarItem}>
                  + Agregar
                </button>
              </div>
            </div>

            {/* Tabla del Carrito Temporal */}
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-2">Producto</th>
                    <th>Cant.</th>
                    <th>P. Unitario</th>
                    <th className="text-end pe-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">No hay productos agregados al ticket.</td>
                    </tr>
                  ) : (
                    carrito.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-2 text-wrap">{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>${Number(item.precioUnitario).toLocaleString()}</td>
                        <td className="text-end pe-2">${item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end align-items-center">
              <h5 className="fw-bold m-0">Total: <span style={{ color: 'var(--titulos, #64141B)' }}>${totalVenta.toLocaleString()}</span></h5>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--titulos, #3E100F)' }}>Confirmar Venta</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default VentasPage;