import { useState, useEffect } from 'react';
import { getPersonas, crearPersona, actualizarPersona, cambiarEstadoPersona } from '../services/personasServices';
import TablaClientes from '../components/TablaClientes';
import Modal from '../../../shared/components/Modal';

export function ClientesPagePrivada() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Estados para modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const estadoInicialForm = {
    dni: '',
    nombre: '',
    fechaNac: '',
    telefono: '',
    mail: '',
    direccion: '',
    clave: '',
    activo: true,
  };

  const [formData, setFormData] = useState(estadoInicialForm);

  const cargarClientes = () => {
    setCargando(true);
    // Llamado SIN parámetros -> devuelve todos los clientes ordenados (activos arriba)
    getPersonas()
      .then((datos) => {
        setClientes(datos);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    const coincideNombre = cliente.nombre.toLowerCase().includes(busquedaMinuscula);
    const coincideDni = String(cliente.dni).includes(busquedaMinuscula);
    return coincideNombre || coincideDni;
  });

  const handleNuevo = () => {
    setClienteSeleccionado(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData({ ...cliente, clave: '' });
    setMostrarModalForm(true);
  };

  const handleVer = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (cliente) => {
    try {
      await cambiarEstadoPersona(cliente.id);
      cargarClientes();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clienteSeleccionado) {
        await actualizarPersona(clienteSeleccionado.id, { ...formData, rol: 'cliente' });
      } else {
        await crearPersona({ ...formData, rol: 'cliente' });
      }
      setMostrarModalForm(false);
      cargarClientes();
    } catch (err) {
      alert(err.message || 'Error al guardar cliente');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar cliente por nombre o DNI..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
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
            <TablaClientes
              clientes={clientesFiltrados}
              onVer={handleVer}
              onEditar={handleEditar}
              onToggleEstado={handleToggleEstado}
            />
          </tbody>
        </table>
      </div>

      {/* Formulario ABM */}
      {mostrarModalForm && (
        <Modal
          titulo={clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'}
          onClose={() => setMostrarModalForm(false)}
        >
          <form onSubmit={handleSubmit} className="row g-3">
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
              <input type="email" className="form-control" name="mail" value={formData.mail} onChange={handleChange} required disabled={!!clienteSeleccionado} />
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
            <div className="modal-footer border-0 px-0 pb-0 pt-3 w-100 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--paneles)' }}>Guardar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Vista de Detalle */}
      {mostrarModalVer && clienteSeleccionado && (
        <Modal
          titulo="Detalle del Cliente"
          onClose={() => setMostrarModalVer(false)}
        >
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
        </Modal>
      )}
    </div>
  );
}

export default ClientesPagePrivada;