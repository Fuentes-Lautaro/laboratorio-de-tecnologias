import { useState, useEffect } from 'react';
import { getVentas, crearVenta, getVentaPorId } from '../services/ventaService';
import { getProductos } from '../../productos/services/productosServices';
import { getEventos } from '../../eventos/services/eventoService';
import {
  buscarPersonaPorDni,
  crearPersona,
  cambiarEstadoPersona
} from '../../personas/services/personasServices';
import { TablaVentas } from '../components/TablaVentas';
import { Modal } from '../../../shared/components/Modal';

export function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [clienteDni, setClienteDni] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [eventoId, setEventoId] = useState('');

  // Estados para búsqueda, reactivación y alta rápida de cliente dentro del modal
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [clienteInactivo, setClienteInactivo] = useState(null);
  const [reactivandoCliente, setReactivandoCliente] = useState(false);
  const [clienteNoExiste, setClienteNoExiste] = useState(false);
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);
  const [guardandoCliente, setGuardandoCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    fechaNac: '',
    mail: '',
    telefono: '',
    direccion: ''
  });

  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const [alerta, setAlerta] = useState(null);
  const [alertaModal, setAlertaModal] = useState(null);

  useEffect(() => {
    cargarLista();
  }, []);

  // Búsqueda automática de cliente cuando el DNI tiene 7 u 8 dígitos
  useEffect(() => {
    if (!mostrarModalForm) return;

    const dniLimpio = clienteDni.trim();

    if (!/^\d{7,8}$/.test(dniLimpio)) {
      setClienteEncontrado(null);
      setClienteInactivo(null);
      setClienteNoExiste(false);
      setMostrarFormCliente(false);
      setBuscandoCliente(false);
      return;
    }

    // Si ya tenemos cargado el cliente activo con ese mismo DNI, no volver a buscar
    if (clienteEncontrado && String(clienteEncontrado.dni) === dniLimpio) {
      return;
    }

    let cancelado = false;
    setBuscandoCliente(true);
    setClienteNoExiste(false);
    setClienteInactivo(null);

    const timer = setTimeout(async () => {
      try {
        const persona = await buscarPersonaPorDni(dniLimpio);
        if (cancelado) return;

        if (persona) {
          if (persona.activo === false) {
            setClienteEncontrado(null);
            setClienteInactivo(persona);
            setClienteNoExiste(false);
            setMostrarFormCliente(false);
          } else {
            setClienteEncontrado(persona);
            setClienteInactivo(null);
            setClienteNoExiste(false);
            setMostrarFormCliente(false);
          }
        } else {
          setClienteEncontrado(null);
          setClienteInactivo(null);
          setClienteNoExiste(true);
        }
      } catch (err) {
        if (!cancelado) {
          setAlertaModal({ texto: err.message || 'Error al buscar el cliente.', tipo: 'danger' });
        }
      } finally {
        if (!cancelado) {
          setBuscandoCliente(false);
        }
      }
    }, 350);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [clienteDni, mostrarModalForm]);

  // Filtra eventos activos cuya fecha sea desde ayer en adelante (ayer, hoy y próximos)
  const filtrarEventosVigentes = (listaEventos = []) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    return listaEventos
      .filter((ev) => {
        if (ev.e_activo === false) return false;
        if (!ev.e_fecha) return false;

        const [anio, mes, dia] = String(ev.e_fecha).split('T')[0].split('-').map(Number);
        const fechaEvento = new Date(anio, mes - 1, dia);
        return fechaEvento >= ayer;
      })
      .sort((a, b) => new Date(a.e_fecha) - new Date(b.e_fecha));
  };

  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return '';
    const [anio, mes, dia] = String(fechaStr).split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };

  const cargarLista = async () => {
    try {
      const [datosVentas, datosProductos, datosEventos] = await Promise.all([
        getVentas(),
        getProductos(),
        getEventos(true)
      ]);
      setVentas(datosVentas || []);
      setProductosDisponibles(datosProductos || []);
      setEventosDisponibles(filtrarEventosVigentes(datosEventos || []));
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

  const resetearEstadoClienteModal = () => {
    setClienteDni('');
    setClienteEncontrado(null);
    setClienteInactivo(null);
    setClienteNoExiste(false);
    setMostrarFormCliente(false);
    setBuscandoCliente(false);
    setReactivandoCliente(false);
    setNuevoCliente({
      nombre: '',
      fechaNac: '',
      mail: '',
      telefono: '',
      direccion: ''
    });
  };

  const handleContinuarSinCliente = () => {
    resetearEstadoClienteModal();
    setAlertaModal(null);
  };

  // Estilos y eventos hover para los botones "Continuar sin cliente"
  const estiloBotonSecundario = {
    backgroundColor: '#FFFFFF',
    color: '#495057',
    border: '1px solid #6c757d',
    transition: 'all 0.15s ease'
  };

  const handleHoverEntrarSecundario = (e) => {
    e.currentTarget.style.backgroundColor = '#5c636a';
    e.currentTarget.style.borderColor = '#5c636a';
    e.currentTarget.style.color = '#FFFFFF';
  };

  const handleHoverSalirSecundario = (e) => {
    e.currentTarget.style.backgroundColor = '#FFFFFF';
    e.currentTarget.style.borderColor = '#6c757d';
    e.currentTarget.style.color = '#495057';
  };

  // Estilo del panel secundario para acciones de cliente dentro del modal
  const estiloPanelCliente = {
    backgroundColor: 'var(--fondo-secundario, #F4EFEA)',
    border: '1px solid rgba(181, 134, 90, 0.35)',
    color: 'var(--titulos, #3E100F)'
  };

  const handleReactivarCliente = async () => {
    if (!clienteInactivo?.id) return;
    setAlertaModal(null);
    setReactivandoCliente(true);

    try {
      const reactivado = await cambiarEstadoPersona(clienteInactivo.id);
      setClienteEncontrado(reactivado);
      setClienteInactivo(null);
      setAlertaModal({
        texto: `Cuenta de "${reactivado.nombre}" reactivada y asociada a la venta.`,
        tipo: 'success'
      });
    } catch (err) {
      setAlertaModal({
        texto: err.message || 'No se pudo reactivar la cuenta del cliente.',
        tipo: 'danger'
      });
    } finally {
      setReactivandoCliente(false);
    }
  };

  const handleGuardarNuevoCliente = async () => {
    setAlertaModal(null);
    const dniLimpio = clienteDni.trim();

    if (!nuevoCliente.nombre.trim() || !nuevoCliente.fechaNac || !nuevoCliente.mail.trim() || !nuevoCliente.telefono.trim()) {
      setAlertaModal({
        texto: 'Completá Nombre, Fecha de nacimiento, Mail y Teléfono para registrar el cliente.',
        tipo: 'danger'
      });
      return;
    }

    setGuardandoCliente(true);
    try {
      const creado = await crearPersona({
        dni: dniLimpio,
        nombre: nuevoCliente.nombre.trim(),
        fechaNac: nuevoCliente.fechaNac,
        mail: nuevoCliente.mail.trim(),
        telefono: nuevoCliente.telefono.trim(),
        direccion: nuevoCliente.direccion.trim(),
        rol: 'cliente'
      });

      setClienteEncontrado(creado);
      setClienteInactivo(null);
      setClienteNoExiste(false);
      setMostrarFormCliente(false);
      setNuevoCliente({ nombre: '', fechaNac: '', mail: '', telefono: '', direccion: '' });
      setAlertaModal({
        texto: `Cliente "${creado.nombre}" registrado y asociado a la venta.`,
        tipo: 'success'
      });
    } catch (err) {
      setAlertaModal({
        texto: err.message || 'No se pudo registrar el cliente.',
        tipo: 'danger'
      });
    } finally {
      setGuardandoCliente(false);
    }
  };

  const ventasFiltradas = ventas.filter((v) => {
    const busqueda = terminoBusqueda.toLowerCase();
    const codigoCoincide = v.codigo?.toLowerCase().includes(busqueda);
    const clienteNombreCoincide = (v.clienteNombre || '').toLowerCase().includes(busqueda);
    const clienteDniCoincide = (v.clienteDni || '').toLowerCase().includes(busqueda);
    const eventoCoincide = (v.eventoNombre || '').toLowerCase().includes(busqueda);
    return codigoCoincide || clienteNombreCoincide || clienteDniCoincide || eventoCoincide;
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
    setAlertaModal(null);
    if (!productoSeleccionadoId) {
      setAlertaModal({ texto: 'Por favor, seleccioná un producto.', tipo: 'danger' });
      return;
    }

    const productoEncontrado = productosDisponibles.find(
      p => String(p.p_id || p.id) === String(productoSeleccionadoId)
    );
    if (!productoEncontrado) return;

    const stockDisponible = Number(productoEncontrado.p_stock ?? productoEncontrado.stock ?? 0);
    const cantNum = Number(cantidad) || 1;

    if (cantNum > stockDisponible) {
      setAlertaModal({ texto: `Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`, tipo: 'danger' });
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
    setAlertaModal(null);

    if (carrito.length === 0) {
      setAlertaModal({ texto: 'Debe agregar al menos un producto al carrito.', tipo: 'danger' });
      return;
    }

    if (clienteDni.trim() !== '' && !clienteEncontrado) {
      setAlertaModal({
        texto: clienteInactivo
          ? 'La cuenta del cliente está inactiva. Reactivala o elegí "Continuar sin cliente".'
          : 'El DNI ingresado no está registrado. Agregá el cliente o elegí "Continuar sin cliente".',
        tipo: 'warning'
      });
      return;
    }

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
      clienteDni: clienteEncontrado ? String(clienteEncontrado.dni) : null,
      eventoId: eventoId !== '' ? Number(eventoId) : null,
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
      resetearEstadoClienteModal();
      setEventoId('');
      setAlertaModal(null);
      mostrarNotificacion('¡Venta registrada con éxito!', 'success');
    } catch (err) {
      console.error('Error al guardar la venta:', err);
      setAlertaModal({
        texto: err.message || 'Error al registrar la venta. Verificá los datos.',
        tipo: 'danger'
      });
    }
  };

  if (cargando) return <p className="text-center py-5">Cargando ventas y productos...</p>;
  if (error) return <p className="text-center py-5 text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid py-3">
      {/* Cartel de Alerta */}
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
            resetearEstadoClienteModal();
            setEventoId('');
            setAlertaModal(null);
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
          placeholder="Buscar por código de venta, cliente, DNI o evento..."
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
                <th>Cliente</th>
                <th>Evento</th>
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
              <strong>Fecha:</strong>{' '}
              {ventaSeleccionada.fecha
                ? new Date(ventaSeleccionada.fecha).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'}
            </div>
            <div className="col-12 col-md-4">
              <strong>Cliente:</strong> {ventaSeleccionada.clienteNombre || '-'}
            </div>
            <div className="col-12 col-md-4">
              <strong>Empleado:</strong>{' '}
              {ventaSeleccionada.empleadoNombre
                ? `${ventaSeleccionada.empleadoNombre}${ventaSeleccionada.empleadoDni ? ` (${ventaSeleccionada.empleadoDni})` : ''}`
                : ventaSeleccionada.empleadoDni || '-'}
            </div>
            <div className="col-12 col-md-4 mt-2">
              <strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago || 'Efectivo'}
            </div>
            <div className="col-12 col-md-8 mt-2">
              <strong>Evento:</strong>{' '}
              <span className="text-muted">
                {ventaSeleccionada.eventoNombre || '-'}
              </span>
            </div>
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
            {/* Alerta visible dentro del modal */}
            {alertaModal && (
              <div className={`alert alert-${alertaModal.tipo} alert-dismissible fade show py-2 px-3 small mb-3`} role="alert">
                <div>{alertaModal.texto}</div>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setAlertaModal(null)}
                  aria-label="Cerrar"
                ></button>
              </div>
            )}

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">DNI del Cliente</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  maxLength={8}
                  className="form-control" 
                  placeholder="Ej: 12345678" 
                  value={clienteDni} 
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    setClienteDni(soloNumeros);
                    if (clienteEncontrado && String(clienteEncontrado.dni) !== soloNumeros) {
                      setClienteEncontrado(null);
                    }
                  }} 
                />
                {buscandoCliente && (
                  <small className="text-muted d-block mt-1">Buscando cliente...</small>
                )}
                {!buscandoCliente && clienteEncontrado && (
                  <div className="small text-success fw-semibold mt-1">
                    ✓ Cliente: {clienteEncontrado.nombre}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Método de Pago *</label>
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

              {/* Aviso dentro del modal cuando el cliente existe pero su cuenta está inactiva */}
              {!buscandoCliente && clienteInactivo && (
                <div className="col-12">
                  <div
                    className="rounded-3 py-2 px-3 mb-0 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
                    style={estiloPanelCliente}
                  >
                    <div className="small">
                      <strong>Cuenta inactiva</strong>
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: 'var(--titulos, #3E100F)' }}
                        onClick={handleReactivarCliente}
                        disabled={reactivandoCliente}
                      >
                        {reactivandoCliente ? 'Activando...' : 'Activar cuenta'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={estiloBotonSecundario}
                        onMouseEnter={handleHoverEntrarSecundario}
                        onMouseLeave={handleHoverSalirSecundario}
                        onClick={handleContinuarSinCliente}
                        disabled={reactivandoCliente}
                      >
                        Continuar sin cliente
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Aviso dentro del modal cuando el DNI no está registrado */}
              {!buscandoCliente && clienteNoExiste && !mostrarFormCliente && (
                <div className="col-12">
                  <div
                    className="rounded-3 py-2 px-3 mb-0 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
                    style={estiloPanelCliente}
                  >
                    <div className="small">
                      <strong>Cliente no encontrado</strong>
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: 'var(--titulos, #3E100F)' }}
                        onClick={() => {
                          setAlertaModal(null);
                          setMostrarFormCliente(true);
                        }}
                      >
                        + Agregar cliente
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={estiloBotonSecundario}
                        onMouseEnter={handleHoverEntrarSecundario}
                        onMouseLeave={handleHoverSalirSecundario}
                        onClick={handleContinuarSinCliente}
                      >
                        Continuar sin cliente
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-formulario inline para alta rápida de cliente */}
              {mostrarFormCliente && (
                <div className="col-12">
                  <div className="p-3 rounded-3" style={estiloPanelCliente}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold small mb-0" style={{ color: 'var(--titulos, #3E100F)' }}>
                        Nuevo Cliente (DNI: {clienteDni})
                      </h6>
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                        onClick={() => setMostrarFormCliente(false)}
                      >
                        Cancelar alta
                      </button>
                    </div>

                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <label className="form-label small text-muted mb-1">Nombre completo *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Ej: Juan Pérez"
                          value={nuevoCliente.nombre}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small text-muted mb-1">Fecha de nacimiento *</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={nuevoCliente.fechaNac}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, fechaNac: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small text-muted mb-1">Mail *</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="cliente@ejemplo.com"
                          value={nuevoCliente.mail}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, mail: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small text-muted mb-1">Teléfono *</label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          placeholder="Ej: 2664123456"
                          value={nuevoCliente.telefono}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted mb-1">Dirección (opcional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Calle, número, localidad"
                          value={nuevoCliente.direccion}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={estiloBotonSecundario}
                        onMouseEnter={handleHoverEntrarSecundario}
                        onMouseLeave={handleHoverSalirSecundario}
                        onClick={handleContinuarSinCliente}
                        disabled={guardandoCliente}
                      >
                        Continuar sin cliente
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
                        onClick={handleGuardarNuevoCliente}
                        disabled={guardandoCliente}
                      >
                        {guardandoCliente ? 'Guardando...' : 'Guardar y asociar cliente'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12">
                <label className="form-label small fw-bold">Evento Asociado</label>
                <select 
                  className="form-select" 
                  value={eventoId} 
                  onChange={(e) => setEventoId(e.target.value)}
                >
                  <option value="">-</option>
                  {eventosDisponibles.map((ev) => (
                    <option key={ev.e_id} value={ev.e_id}>
                      {ev.e_nombre} ({formatearFechaCorta(ev.e_fecha)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-3" />
            <h6 className="fw-bold mb-2">Seleccionar Productos del Catálogo *</h6>
            
            <div className="row g-2 align-items-end mb-3 bg-light p-2 rounded border">
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted mb-1">Producto *</label>
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
                <label className="form-label small text-muted mb-1">Cantidad *</label>
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

            {/* Tabla del Carrito Temporal */}
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