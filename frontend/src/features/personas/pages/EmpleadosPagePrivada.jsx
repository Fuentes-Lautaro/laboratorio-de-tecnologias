import { useState, useEffect } from 'react';
import {
  getPersonas,
  crearPersona,
  actualizarPersona,
  cambiarEstadoPersona,
} from '../services/personasServices';
import TablaEmpleados from '../components/TablaEmpleados';
import Modal from '../../../shared/components/Modal';

export function EmpleadosPagePrivada() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const estadoInicialForm = {
    dni: '',
    nombre: '',
    fechaNac: '',
    telefono: '',
    mail: '',
    direccion: '',
    clave: '',
    activo: true,
    rol: 'vendedor',
  };
  const [formData, setFormData] = useState(estadoInicialForm);

  const cargarEmpleados = () => {
    setCargando(true);
    // Llamado CON parámetros -> devuelve roles != 'cliente' agrupados por activo y rol (vendedor -> cm -> gerente)
    getPersonas({ tipo: 'empleado' })
      .then((datos) => {
        setEmpleados(datos);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    const coincideNombre = empleado.nombre.toLowerCase().includes(busquedaMinuscula);
    const coincideDni = String(empleado.dni).includes(busquedaMinuscula);
    return coincideNombre || coincideDni;
  });

  const handleNuevo = () => {
    setEmpleadoSeleccionado(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setFormData({
      ...empleado,
      rol: empleado.rol?.toLowerCase() || 'vendedor',
      clave: '',
    });
    setMostrarModalForm(true);
  };

  const handleToggleEstado = async (empleado) => {
    try {
      await cambiarEstadoPersona(empleado.id);
      cargarEmpleados();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (empleadoSeleccionado) {
        await actualizarPersona(empleadoSeleccionado.id, formData);
      } else {
        await crearPersona(formData);
      }
      setMostrarModalForm(false);
      cargarEmpleados();
    } catch (err) {
      alert(err.message || 'Error al guardar empleado');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getEstiloRol = (rol) => {
    switch ((rol || '').toLowerCase()) {
      case 'gerente':
        return { backgroundColor: 'var(--titulos, #3E100F)', color: '#FFF' };
      case 'cm':
        return { backgroundColor: 'var(--paneles, #64141B)', color: '#FFF' };
      default:
        return { backgroundColor: 'var(--detalles, #B5865A)', color: '#FFF' };
    }
  };

  if (cargando) return <p className="text-center py-5">Cargando empleados...</p>;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos)' }}>Empleados</h3>
        <button onClick={handleNuevo} className="btn text-white shadow-sm" style={{ backgroundColor: 'var(--detalles, #B5865A)' }}>
          + Agregar Empleado
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm border-0"
          placeholder="Buscar empleado por nombre o DNI..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          style={{ maxWidth: '400px', backgroundColor: '#fff' }}
        />
      </div>

      {/* Tabla Principal */}
      <div className="p-4 rounded-3 bg-white shadow-sm border">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th style={{ color: 'var(--paneles)' }}>Nombre</th>
              <th style={{ color: 'var(--paneles)' }}>DNI</th>
              <th style={{ color: 'var(--paneles)' }}>Mail</th>
              <th style={{ color: 'var(--paneles)' }}>Rol</th>
              <th style={{ color: 'var(--paneles)' }}>Estado</th>
              <th className="text-end" style={{ color: 'var(--paneles)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <TablaEmpleados
              empleados={empleadosFiltrados}
              getEstiloRol={getEstiloRol}
              onEditar={handleEditar}
              onToggleEstado={handleToggleEstado}
            />
          </tbody>
        </table>
      </div>

      {/* Formulario */}
      {mostrarModalForm && (
        <Modal
          titulo={empleadoSeleccionado ? 'Editar Empleado' : 'Nuevo Empleado'}
          onClose={() => setMostrarModalForm(false)}
        >
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>DNI</label>
              <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} required disabled={!!empleadoSeleccionado} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Nombre Completo</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Fecha de Nacimiento</label>
              <input type="date" className="form-control" name="fechaNac" value={formData.fechaNac} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Teléfono</label>
              <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Mail</label>
              <input type="email" className="form-control" name="mail" value={formData.mail} onChange={handleChange} required disabled={!!empleadoSeleccionado} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Dirección</label>
              <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--titulos)' }}>Rol en el Sistema</label>
              <select className="form-select border-secondary shadow-sm" name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="vendedor">Vendedor</option>
                <option value="cm">Community Manager (CM)</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--titulos)' }}>
                {empleadoSeleccionado ? 'Clave (Editar para cambiar)' : 'Clave Inicial'}
              </label>
              <input
                type="password"
                className="form-control shadow-sm"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                required={!empleadoSeleccionado}
              />
            </div>

            <div className="col-12 text-end mt-4">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
              <button type="submit" className="btn text-white px-4" style={{ backgroundColor: 'var(--paneles, #64141B)' }}>Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default EmpleadosPagePrivada;