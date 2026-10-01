import { useState, useEffect } from 'react';
import { getEmpleados, crearEmpleado, actualizarEmpleado } from '../services/empleadoService';

export function EmpleadosPagePrivada() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  
  const estadoInicialForm = {
    dni: '', nombre: '', fechaNac: '', telefono: '', mail: '', direccion: '', clave: '', activo: true, rol: 'Vendedor'
  };
  const [formData, setFormData] = useState(estadoInicialForm);

  useEffect(() => {
    getEmpleados()
      .then(datos => {
        setEmpleados(datos);
        setCargando(false);
      })
      .catch(console.error);
  }, []);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const busquedaMinuscula = terminoBusqueda.toLowerCase();
    const coincideNombre = empleado.nombre.toLowerCase().includes(busquedaMinuscula);
    const coincideDni = empleado.dni.includes(busquedaMinuscula);
    return coincideNombre || coincideDni;
  });

  const handleNuevo = () => {
    setEmpleadoSeleccionado(null);
    setFormData(estadoInicialForm);
    setMostrarModalForm(true);
  };

  const handleEditar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setFormData(empleado);
    setMostrarModalForm(true);
  };

  const handleVer = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setMostrarModalVer(true);
  };

  const handleToggleEstado = async (empleado) => {
    try {
      const empleadoActualizado = { ...empleado, activo: !empleado.activo };
      const guardado = await actualizarEmpleado(empleado.dni, empleadoActualizado);
      setEmpleados(empleados.map(e => e.dni === empleado.dni ? guardado : e));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (empleadoSeleccionado) {
        const guardado = await actualizarEmpleado(empleadoSeleccionado.dni, formData);
        setEmpleados(empleados.map(e => e.dni === empleadoSeleccionado.dni ? guardado : e));
      } else {
        const nuevo = await crearEmpleado(formData);
        setEmpleados([...empleados, nuevo]);
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

  // Función auxiliar para obtener el estilo del rol
  const getEstiloRol = (rol) => {
    switch(rol) {
      case 'gerente':
        return { backgroundColor: 'var(--titulos, #64141B)', color: '#FFF' };
      case 'CM':
        return { backgroundColor: 'var(--detalles, #B5865A)', color: '#3E100F' };
      default: // Vendedor u otros
        return { backgroundColor: 'var(--referencias, #513B2A)', color: '#FFF' };
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
            {empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map(empleado => (
                <tr key={empleado.dni} style={{ opacity: empleado.activo ? 1 : 0.6 }}>
                  <td className="fw-semibold" style={{ color: 'var(--texto)' }}>{empleado.nombre}</td>
                  <td style={{ color: 'var(--texto)' }}>{empleado.dni}</td>
                  <td style={{ color: 'var(--texto)' }}>{empleado.mail}</td>
                  
                  {/* Etiqueta de Rol Estilizada */}
                  <td>
                    <span 
                      className="badge px-3 py-2 shadow-sm" 
                      style={{ 
                        ...getEstiloRol(empleado.rol), 
                        letterSpacing: '0.5px', 
                        fontWeight: '600',
                        borderRadius: '6px'
                      }}
                    >
                      {empleado.rol}
                    </span>
                  </td>

                  <td>
                    <span className={`badge bg-${empleado.activo ? 'success' : 'secondary'} bg-opacity-25 text-${empleado.activo ? 'success' : 'secondary'} px-2 py-1`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        onClick={() => handleEditar(empleado)} 
                        className="btn btn-sm btn-light d-flex align-items-center gap-1 border shadow-sm"
                        style={{ color: 'var(--paneles, #3E100F)', fontSize: '0.85rem' }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleToggleEstado(empleado)} 
                        className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${empleado.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {empleado.activo ? '🚫 Baja' : '✅ Alta'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No se encontraron empleados con "{terminoBusqueda}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario ABM */}
      {mostrarModalForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header" style={{ backgroundColor: 'var(--titulos)', color: 'white' }}>
                <h5 className="modal-title fw-bold">{empleadoSeleccionado ? 'Editar Empleado' : 'Nuevo Empleado'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalForm(false)}></button>
              </div>
              <div className="modal-body p-4 row g-3">
                
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
                  <input type="email" className="form-control" name="mail" value={formData.mail} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--texto)' }}>Dirección</label>
                  <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>

                {/* SELECTOR DE ROL - Ahora editable siempre */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--titulos)' }}>Rol en el Sistema</label>
                  <select className="form-select border-secondary shadow-sm" name="rol" value={formData.rol} onChange={handleChange} required>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Gerente">Gerente</option>
                    <option value="CM">Community Manager (CM)</option>
                  </select>
                </div>

                
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--titulos)' }}>
                    {empleadoSeleccionado ? 'Clave (Editar para cambiar)' : 'Clave Inicial'}
                  </label>
                  <input 
                    type="text" 
                    className="form-control shadow-sm" 
                    name="clave" 
                    value={formData.clave} 
                    onChange={handleChange} 
                    required={!empleadoSeleccionado} // Solo es obligatorio si estás creando uno nuevo
                  />
                </div>

              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setMostrarModalForm(false)}>Cancelar</button>
                <button type="submit" className="btn text-white px-4" style={{ backgroundColor: 'var(--paneles)' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmpleadosPagePrivada;