import { useState, useEffect } from 'react';
import EventoCard from '../componentes/EventoCard';
import { getEventos } from '../services/eventoService';

export function EventosPagePrivada() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Formulario con el campo imagenUrl
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    fecha: '',
    descripcion: '',
    cantAsistentes: '',
    imagenUrl: ''
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      setCargando(true);
      const data = await getEventos();
      setEventos(data);
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.fecha) return;

    const payload = {
      ...formData,
      cantAsistentes: Number(formData.cantAsistentes) || 0
    };

    try {
      if (editando) {
        const actualizado = await eventoService.actualizarEvento(formData.id, payload);
        setEventos(eventos.map((evt) => (evt.id === formData.id ? actualizado : evt)));
      } else {
        const nuevo = await eventoService.crearEvento(payload);
        setEventos([...eventos, nuevo]);
      }
      resetFormulario();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditar = (evento) => {
    setFormData({
      id: evento.id,
      nombre: evento.nombre || '',
      fecha: evento.fecha || '',
      descripcion: evento.descripcion || '',
      cantAsistentes: evento.cantAsistentes || '',
      imagenUrl: evento.imagenUrl || ''
    });
    setEditando(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Deseas eliminar este evento?')) return;
    try {
      await eventoService.eliminarEvento(id);
      setEventos(eventos.filter((evt) => evt.id !== id));
      if (formData.id === id) resetFormulario();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetFormulario = () => {
    setFormData({ id: null, nombre: '', fecha: '', descripcion: '', cantAsistentes: '', imagenUrl: '' });
    setEditando(false);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderColor: '#E5E0DC' }}>
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Gestión de Eventos</h3>
          <p className="text-muted small mb-0">Publicá la cartelera de eventos con fotos y descripción.</p>
        </div>
        <button onClick={cargarEventos} className="btn btn-sm btn-outline-secondary">
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-4">
        {/* LADO IZQUIERDO: Cards de Eventos */}
        <div className="col-lg-7 col-xl-8">
          {cargando ? (
            <div className="text-center py-5 text-muted">Cargando eventos...</div>
          ) : eventos.length === 0 ? (
            <div className="p-5 text-center bg-white rounded-3 border text-muted">
              No hay eventos cargados. Agregá uno usando el formulario.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {eventos.map((evt) => (
                <div key={evt.id} className="col">
                  <EventoCard
                    evento={evt}
                    esGestion={true}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LADO DERECHO: Formulario de Alta / Modificación */}
        <div className="col-lg-5 col-xl-4">
          <div className="bg-white rounded-3 p-4 shadow-sm border sticky-top" style={{ top: '90px', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0" style={{ fontSize: '1.05rem', color: '#3E100F' }}>
                {editando ? 'Modificar Evento' : 'Crear Nuevo Evento'}
              </h5>
              {editando && <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>Edición</span>}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Nombre del Evento</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Cata Guiada Reserva"
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Fecha</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Capacidad</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-sm"
                    name="cantAsistentes"
                    value={formData.cantAsistentes}
                    onChange={handleChange}
                    placeholder="Ej: 25"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">URL de la Imagen / Foto</label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Descripción</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="3"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Detalles del evento..."
                ></textarea>
              </div>

              <div className="d-flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold"
                  style={{
                    backgroundColor: editando ? '#B5865A' : '#3E100F',
                    color: '#FFF',
                    fontSize: '0.875rem'
                  }}
                >
                  {editando ? 'Guardar Cambios' : 'Publicar Evento'}
                </button>

                {editando && (
                  <button
                    type="button"
                    onClick={resetFormulario}
                    className="btn btn-outline-secondary py-2"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventosPagePrivada;