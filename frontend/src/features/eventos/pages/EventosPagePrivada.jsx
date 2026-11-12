import React, { useState, useEffect } from 'react';
import EventoCard from '../components/EventoCard';
import { 
  getEventos, 
  crearEvento, 
  actualizarEvento, 
  cambiarEstadoEvento 
} from '../services/eventoService';

const FORM_INICIAL = {
  e_nombre: '',
  e_fecha: '',
  e_descripcion: '',
  e_cant_asist: 10
};

// Convierte la fecha devuelta por PostgreSQL ("2026-11-15T00:00:00.000Z") al formato YYYY-MM-DD para <input type="date">
const formatearFechaParaInput = (fechaStr) => {
  if (!fechaStr) return '';
  return fechaStr.split('T')[0];
};

const obtenerFechaHoyISO = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const ordenarEventosGestion = (lista) => {
  const hoyISO = obtenerFechaHoyISO();

  const obtenerGrupo = (ev) => {
    const activo = ev.e_activo ?? true;
    const fecha = formatearFechaParaInput(ev.e_fecha);
    const esProximo = fecha >= hoyISO;

    if (activo && esProximo) return 1;
    if (activo && !esProximo) return 2;
    if (!activo && esProximo) return 3;
    return 4;
  };

  return [...lista].sort((a, b) => {
    const grupoA = obtenerGrupo(a);
    const grupoB = obtenerGrupo(b);
    if (grupoA !== grupoB) return grupoA - grupoB;

    const fechaA = formatearFechaParaInput(a.e_fecha);
    const fechaB = formatearFechaParaInput(b.e_fecha);

    if (grupoA === 1 || grupoA === 3) {
      return fechaA.localeCompare(fechaB);
    }
    return fechaB.localeCompare(fechaA);
  });
};

export function EventosPagePrivada() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null); // null = Crear, objeto = Editar
  const [eventoACambiarEstado, setEventoACambiarEstado] = useState(null);

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    cargarLista();
  }, []);

  const cargarLista = async () => {
    try {
      const data = await getEventos(true);
      setEventos(ordenarEventosGestion(data || []));
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      mostrarNotificacion('Error al cargar la lista de eventos: ' + err.message, 'danger');
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

  const handleAbrirCrear = () => {
    setEventoEditando(null);
    setFormData(FORM_INICIAL);
    setMostrarModalForm(true);
  };

  const handleAbrirEditar = (evento) => {
    setEventoEditando(evento);
    setFormData({
      e_nombre: evento.e_nombre || '',
      e_fecha: formatearFechaParaInput(evento.e_fecha),
      e_descripcion: evento.e_descripcion || '',
      e_cant_asist: evento.e_cant_asist ?? 10
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
      const id = eventoEditando?.e_id;

      const payload = {
        nombre: formData.e_nombre,
        fecha: formData.e_fecha,
        descripcion: formData.e_descripcion,
        cant_asist: Number(formData.e_cant_asist)
      };

      if (eventoEditando) {
        if (!id) throw new Error('No se encontró el ID del evento a actualizar');

        const guardado = await actualizarEvento(id, payload);

        setEventos((prev) =>
          ordenarEventosGestion(prev.map((item) => (item.e_id === id ? guardado : item)))
        );
        mostrarNotificacion('¡Evento actualizado con éxito!', 'success');
      } else {
        const nuevo = await crearEvento(payload);
        setEventos((prev) => ordenarEventosGestion([...prev, nuevo]));
        mostrarNotificacion('¡Evento creado con éxito!', 'success');
      }

      setMostrarModalForm(false);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      mostrarNotificacion('Error al guardar el evento: ' + error.message, 'danger');
    }
  };

  const handleSolicitarCambioEstado = (id) => {
    const encontrado = eventos.find((ev) => ev.e_id === id);
    if (encontrado) setEventoACambiarEstado(encontrado);
  };

  const handleConfirmarCambioEstado = async () => {
    if (!eventoACambiarEstado) return;
    const id = eventoACambiarEstado.e_id;

    if (!id) {
      mostrarNotificacion('Error: No se encontró el ID del evento.', 'danger');
      return;
    }

    try {
      const actualizado = await cambiarEstadoEvento(id);
      setEventos((prev) =>
        ordenarEventosGestion(prev.map((item) => (item.e_id === id ? actualizado : item)))
      );
      setEventoACambiarEstado(null);
      mostrarNotificacion(
        actualizado.e_activo ? '¡Evento activado con éxito!' : '¡Evento desactivado con éxito!',
        'success'
      );
    } catch (error) {
      console.error('Error al cambiar estado del evento:', error);
      setEventoACambiarEstado(null);
      mostrarNotificacion('Error al cambiar estado del evento: ' + error.message, 'danger');
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* Alerta de notificación */}
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
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#3E100F' }}>Gestión de Eventos</h2>
          <p className="text-muted small mb-0">Administrá la cartelera de eventos y cupos disponibles.</p>
        </div>
        <button 
          onClick={handleAbrirCrear}
          className="btn text-white fw-semibold px-3 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2"
          style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
        >
          <span>+</span> Nuevo Evento
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
            <div key={evento.e_id} className="col-12 col-md-6 col-lg-4">
              <EventoCard
                evento={evento}
                esGestion={true}
                onEditar={handleAbrirEditar}
                onCambiarEstado={handleSolicitarCambioEstado}
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

      {/* MODAL CREAR / EDITAR */}
      {mostrarModalForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: 'var(--titulos, #B5865A)' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {eventoEditando ? '✏️ Editar Evento' : 'Crear Nuevo Evento'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalForm(false)}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="modal-body p-4" style={{ backgroundColor: '#FAF6F0' }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold" style={{ color: 'var(--titulos, #B5865A)' }}>Nombre del Evento</label>
                      <input
                        type="text"
                        name="e_nombre"
                        required
                        className="form-control"
                        value={formData.e_nombre}
                        onChange={handleChangeForm}
                        placeholder="Ej: Cata Guiada Reserva & Quesos"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--titulos, #B5865A)' }}>Fecha</label>
                      <input
                        type="date"
                        name="e_fecha"
                        required
                        className="form-control"
                        value={formData.e_fecha}
                        onChange={handleChangeForm}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--titulos, #B5865A)' }}>Cupos / Asistentes</label>
                      <input
                        type="number"
                        name="e_cant_asist"
                        min="1"
                        required
                        className="form-control"
                        value={formData.e_cant_asist}
                        onChange={handleChangeForm}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold" style={{ color: '#3E100F' }}>Descripción</label>
                      <textarea
                        name="e_descripcion"
                        rows="3"
                        className="form-control"
                        value={formData.e_descripcion}
                        onChange={handleChangeForm}
                        placeholder="Detalles sobre el menú, maridaje o la experiencia..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 justify-content-end gap-2" style={{ backgroundColor: '#FAF6F0' }}>
                  <button 
                    type="button" 
                    className="btn btn-sm px-3 fw-semibold" 
                    style={{ backgroundColor: 'transparent', color: '#3E100F', border: '1px solid #3E100F' }} 
                    onClick={() => setMostrarModalForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-sm text-white px-4 fw-semibold" 
                    style={{ backgroundColor: '#B5865A' }}
                  >
                    {eventoEditando ? 'Guardar Cambios' : 'Crear Evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACTIVAR / DESACTIVAR */}
      {eventoACambiarEstado && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#3E100F' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {eventoACambiarEstado.e_activo ? 'Confirmar Desactivación' : 'Confirmar Activación'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEventoACambiarEstado(null)}></button>
              </div>

              <div className="modal-body p-4 text-center" style={{ backgroundColor: '#FAF6F0' }}>
                <p className="mb-2 fs-6" style={{ color: '#1C1614' }}>
                  ¿Estás seguro de que deseas {eventoACambiarEstado.e_activo ? 'desactivar' : 'activar'} el evento?
                </p>
                <div className="p-3 rounded-2 fw-bold text-start mb-3 shadow-sm" style={{ backgroundColor: '#FFFFFF', color: '#3E100F', borderLeft: '4px solid #B5865A' }}>
                  {eventoACambiarEstado.e_nombre}
                </div>
                <small className="text-muted">
                  {eventoACambiarEstado.e_activo
                    ? 'El evento dejará de mostrarse en la cartelera pública, pero se conservará su historial de ventas.'
                    : 'El evento volverá a mostrarse en la cartelera pública si su fecha es vigente.'}
                </small>
              </div>

              <div className="modal-footer border-0 justify-content-end gap-2" style={{ backgroundColor: '#FAF6F0' }}>
                <button 
                  type="button" 
                  className="btn btn-sm px-3 fw-semibold" 
                  style={{ backgroundColor: 'transparent', color: '#3E100F', border: '1px solid #3E100F' }} 
                  onClick={() => setEventoACambiarEstado(null)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm text-white px-3 fw-semibold" 
                  style={{ 
                    backgroundColor: eventoACambiarEstado.e_activo ? '#A93226' : '#3E100F', 
                    borderColor: eventoACambiarEstado.e_activo ? '#A93226' : '#3E100F' 
                  }} 
                  onClick={handleConfirmarCambioEstado}
                >
                  {eventoACambiarEstado.e_activo ? 'Sí, Desactivar' : 'Sí, Activar'}
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