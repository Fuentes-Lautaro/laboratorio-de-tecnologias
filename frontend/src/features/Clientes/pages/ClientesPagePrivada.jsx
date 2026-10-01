import { useState, useEffect } from 'react';
import { getClientes, crearCliente, actualizarCliente } from '../services/clienteService';

export function ClientesPagePrivada() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // estado para la búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estados para modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  const estadoInicialForm = {
    dni: '', nombre: '', fechaNac: '', telefono: '', mail: '', direccion: '', clave: '', activo: true
  };
  const [formData, setFormData] = useState(estadoInicialForm);
  useEffect(() => {
    getClientes()
      .then(datos => {
        setClientes(datos);
        setCargando(false);
      })
      .catch(console.error);
  }, []);

  // --- LÓGICA DE FILTRADO ---
  // Filtramos los clientes en base al texto ingresado en el buscador (por nombre o DNI)
  const clientesFiltrados = clientes.filter((cliente) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    const coincideNombre = cliente.nombre.toLowerCase().includes(busquedaMinuscula);
    const coincideDni = cliente.dni.includes(busquedaMinuscula);
    return coincideNombre || coincideDni;
  });

  // --- MANEJADORES DE ACCIONES ---
  const handleNuevo = () => {
    setClienteSeleccionado(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData(cliente);
    setMostrarModalForm(true);
  };

  const handleVer = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (cliente) => {
    try {
      const clienteActualizado = { ...cliente, activo: !cliente.activo };
      const guardado = await actualizarCliente(cliente.dni, clienteActualizado);
      setClientes(clientes.map(c => c.dni === cliente.dni ? guardado : c));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clienteSeleccionado) {
        const guardado = await actualizarCliente(clienteSeleccionado.dni, formData);
        setClientes(clientes.map(c => c.dni === clienteSeleccionado.dni ? guardado : c));
      } else {
        const nuevo = await crearCliente(formData);
        setClientes([...clientes, nuevo]);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setMostrarModalForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // El cambio en el input de búsqueda actualiza el estado directamente
  const handleBusquedaChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  if (cargando) return <p className="text-center py-5">Cargando clientes...</p>;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos)' }}>Clientes</h3>
        <button onClick={handleNuevo} className="btn text-white" style={{ backgroundColor: 'var(--detalles)' }}>
          + Agregar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar cliente por nombre o DNI..." 
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
              <th>Nombre</th>
              <th>DNI</th>
              <th>Mail</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Ahora mapeamos clientesFiltrados en lugar del estado crudo 'clientes' */}
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map(cliente => (
                <tr key={cliente.dni} style={{ opacity: cliente.activo ? 1 : 0.6 }}>
                  <td className="fw-semibold">{cliente.nombre}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.mail}</td>
                  <td>
                    <span className={`badge bg-${cliente.activo ? 'success' : 'secondary'} bg-opacity-25 text-${cliente.activo ? 'success' : 'secondary'}`}>
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        onClick={() => handleVer(cliente)} 
                        className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                        style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
                      >
                        👁️ Ver
                      </button>
                      
                      <button 
                        onClick={() => handleEditar(cliente)} 
                        className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                        style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
                      >
                        ✏️ Editar
                      </button>
                      
                      <button 
                        onClick={() => handleToggleEstado(cliente)} 
                        className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${cliente.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {cliente.activo ? '🚫 Baja' : '✅ Alta'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No se encontraron clientes con "{terminoBusqueda}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Formulario ABM */}
      {mostrarModalForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalForm(false)}></button>
              </div>
              <div className="modal-body p-4 row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">DNI</label>
                  <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} required disabled={!!clienteSeleccionado} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Nombre Completo</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Fecha de Nacimiento</label>
                  <input type="date" className="form-control" name="fechaNac" value={formData.fechaNac} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Teléfono</label>
                  <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Mail</label>
                  <input type="email" className="form-control" name="mail" value={formData.mail} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Dirección</label>
                  <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>
                {!clienteSeleccionado && (
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Clave Inicial</label>
                    <input type="password" className="form-control" name="clave" value={formData.clave} onChange={handleChange} required />
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
                <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--paneles)' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* -Vista de Tarjeta (Ver Detalle) */}
      {mostrarModalVer && clienteSeleccionado && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="card border-0">
                <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--titulos)' }}>
                  <h5 className="mb-0 fw-bold">Detalle del Cliente</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalVer(false)}></button>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h4 className="fw-bold text-dark mb-0">{clienteSeleccionado.nombre}</h4>
                    <span className={`badge bg-${clienteSeleccionado.activo ? 'success' : 'secondary'} mt-1`}>
                      {clienteSeleccionado.activo ? 'Usuario Activo' : 'Usuario Inactivo'}
                    </span>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0"><strong>DNI:</strong> {clienteSeleccionado.dni}</li>
                    <li className="list-group-item px-0"><strong>Email:</strong> {clienteSeleccionado.mail}</li>
                    <li className="list-group-item px-0"><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</li>
                    <li className="list-group-item px-0"><strong>Nacimiento:</strong> {clienteSeleccionado.fechaNac}</li>
                    <li className="list-group-item px-0"><strong>Dirección:</strong> {clienteSeleccionado.direccion}</li>
                    <li className="list-group-item px-0"><strong>Rol en sistema:</strong> {clienteSeleccionado.rol}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ClientesPagePrivada;