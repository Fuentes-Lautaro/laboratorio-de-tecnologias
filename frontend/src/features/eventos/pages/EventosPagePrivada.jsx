import React, { useState, useEffect } from 'react';
import EventoCard from '../components/EventoCard';
import { 
  getEventos, 
} from '../services/eventoService';

const FORM_INICIAL = {
  nombre: '',
  fecha: '',
  descripcion: '',
  cantAsistentes: 10,
  imagenUrl: '/img/imagenesEventos/eventos.png'
};

export function EventosPagePrivada() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para Modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null); // null = Crear, objeto = Editar
  const [eventoAEliminar, setEventoAEliminar] = useState(null);

  // Estado del Formulario
  const [formData, setFormData] = useState(FORM_INICIAL);

  useEffect(() => {
    cargarLista();
  }, []);

  const cargarLista = async () => {
    try {
      const data = await getEventos();
      setEventos(data || []);
    } catch (err) {
      console.error('Error al cargar eventos:', err);
    } finally {
      setCargando(false);
    }
  };

  // --- MANEJO DE CREAR Y EDITAR ---
  const handleAbrirCrear = () => {
    setEventoEditando(null);
    setFormData(FORM_INICIAL);
    setMostrarModalForm(true);
  };

  const handleAbrirEditar = (evento) => {
    setEventoEditando(evento);
    setFormData({
      nombre: evento.nombre || '',
      fecha: evento.fecha || '',
      descripcion: evento.descripcion || '',
      cantAsistentes: evento.cantAsistentes || 10,
      imagenUrl: evento.imagenUrl || '/img/imagenesEventos/eventos.png'
    });
    setMostrarModalForm(true);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (eventoEditando) {
        // EDICIÓN
        const guardado = await actualizarEvento(eventoEditando.id, formData);
        setEventos(eventos.map((ev) => (ev.id === eventoEditando.id ? { ...ev, ...guardado } : ev)));
      } else {
        // CREACIÓN
        const nuevo = await crearEvento(formData);
        setEventos([...eventos, nuevo]);
      }
      setMostrarModalForm(false);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  // --- MANEJO DE ELIMINAR ---
  const handleSolicitarEliminar = (id) => {
    const encontrado = eventos.find((ev) => ev.id === id);
    if (encontrado) setEventoAEliminar(encontrado);
  };

  const handleConfirmarEliminar = async () => {
    if (!eventoAEliminar) return;
    try {
      await eliminarEvento(eventoAEliminar.id);
      setEventos(eventos.filter((ev) => ev.id !== eventoAEliminar.id));
      setEventoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* Encabezado con Botón Crear */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#3E100F' }}>Gestión de Eventos</h2>
          <p className="text-muted small mb-0">Administrá la cartelera de eventos, cupos e imágenes.</p>
        </div>
        <button 
          onClick={handleAbrirCrear}
          className="btn text-white fw-semibold px-3 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2"
          style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
        >
          <span>➕</span> Nuevo Evento
        </button>
      </div>

      {/* Grilla de Eventos */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="text-muted small mt-2">Cargando gestión...</p>
        </div>
      ) : (
        <div className="row g-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="col-12 col-md-6 col-lg-4">
              <EventoCard
                evento={evento}
                esGestion={true}
                onEditar={handleAbrirEditar}
                onEliminar={handleSolicitarEliminar}
              />
            </div>
          ))}
          {eventos.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              No hay eventos registrados. Hacé clic en "Nuevo Evento" para agregar uno.
            </div>
          )}
        </div>
      )}

      {/* CREACIÓN / EDICIÓN */}
      {mostrarModalForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#1C1614' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {eventoEditando ? '✏️ Editar Evento' : '✨ Crear Nuevo Evento'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalForm(false)}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-bold">Nombre del Evento</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChangeForm}
                        placeholder="Ej: Cata Guiada Reserva & Quesos"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Fecha</label>
                      <input
                        type="date"
                        name="fecha"
                        required
                        className="form-control"
                        value={formData.fecha}
                        onChange={handleChangeForm}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Cupos / Asistentes</label>
                      <input
                        type="number"
                        name="cantAsistentes"
                        min="1"
                        required
                        className="form-control"
                        value={formData.cantAsistentes}
                        onChange={handleChangeForm}
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-bold">Ruta de Imagen (`/public`)</label>
                      <input
                        type="text"
                        name="imagenUrl"
                        className="form-control"
                        value={formData.imagenUrl}
                        onChange={handleChangeForm}
                        placeholder="/img/imagenesEventos/eventos.png"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Descripción</label>
                      <textarea
                        name="descripcion"
                        rows="3"
                        className="form-control"
                        value={formData.descripcion}
                        onChange={handleChangeForm}
                        placeholder="Detalles sobre el menú, maridaje o la experiencia..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => setMostrarModalForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-sm text-white px-4 fw-semibold" style={{ backgroundColor: '#B5865A' }}>
                    {eventoEditando ? 'Guardar Cambios' : 'Crear Evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     
      {eventoAEliminar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#1C1614' }}>
                <h5 className="modal-title fw-bold fs-6">🗑️ Confirmar Eliminación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEventoAEliminar(null)}></button>
              </div>

              <div className="modal-body p-4 text-center">
                <p className="mb-2 fs-6">¿Estás seguro de que deseas eliminar el evento?</p>
                <div className="p-3 rounded-2 fw-bold text-start mb-3" style={{ backgroundColor: '#F8F9FA', color: '#3E100F', borderLeft: '4px solid #B5865A' }}>
                  {eventoAEliminar.nombre}
                </div>
                <small className="text-muted">Esta acción no se puede deshacer.</small>
              </div>

              <div className="modal-footer border-0 bg-light justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => setEventoAEliminar(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-sm btn-danger px-3 fw-semibold" style={{ backgroundColor: '#A93226', borderColor: '#A93226' }} onClick={handleConfirmarEliminar}>
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventosPagePrivada;