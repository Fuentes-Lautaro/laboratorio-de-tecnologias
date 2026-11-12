import React, { useState } from 'react';

const FALLBACK_IMAGEN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'><rect width='100%' height='100%' fill='%23F3EFEA'/><text x='50%' y='50%' fill='%23B5865A' font-family='sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>Sin Imagen</text></svg>";

const obtenerFechaHoyISO = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

// Helper para dar formato dd-MM-yyyy sin desfasar la zona horaria
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return 'Fecha a confirmar';
  
  const fechaLimpia = fechaStr.split('T')[0];
  const partes = fechaLimpia.split('-');
  
  if (partes.length !== 3) return fechaStr;
  const [anio, mes, dia] = partes;
  
  return `${dia}-${mes}-${anio}`;
};

export function EventoCard({ evento, esGestion = false, onEditar, onCambiarEstado }) {
  const [hoverBotonEstado, setHoverBotonEstado] = useState(false);

  if (!evento) return null;

  // Desestructuración con fallbacks para PostgreSQL (e_) y propiedades genéricas
  const id = evento.e_id ?? evento.id;
  const nombre = evento.e_nombre ?? evento.nombre ?? '';
  const fecha = evento.e_fecha ?? evento.fecha ?? '';
  const descripcion = evento.e_descripcion ?? evento.descripcion ?? '';
  const cantAsist = evento.e_cant_asist ?? evento.e_cant_asists ?? evento.cantAsist ?? 0;
  const urlImagen = evento.e_url_imagen ?? evento.urlImagen ?? FALLBACK_IMAGEN;
  const estaActivo = evento.e_activo ?? evento.activo ?? true;

  const fechaLimpia = fecha ? fecha.split('T')[0] : '';
  const esPasado = fechaLimpia !== '' && fechaLimpia < obtenerFechaHoyISO();
  const mostrarBadgeFinalizado = esGestion && estaActivo && esPasado;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGEN;
  };

  return (
    <div
      className={`card h-100 shadow-sm border-0 rounded-3 overflow-hidden ${
        !estaActivo && esGestion ? 'opacity-50 bg-light' : ''
      }`}
      style={!estaActivo && esGestion ? { filter: 'grayscale(70%)' } : {}}
    >
      {/* Portada del Evento */}
      <div style={{ height: '160px', backgroundColor: '#F3EFEA', overflow: 'hidden' }}>
        <img
          src={urlImagen || FALLBACK_IMAGEN}
          alt={nombre}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={handleImageError}
        />
      </div>

      <div className="card-header bg-transparent border-0 pt-3 px-3 pb-0 d-flex justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-1 flex-wrap">
          <span 
            className="badge rounded-pill px-2.5 py-1" 
            style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#000', fontSize: '0.75rem' }}
          >
            📅 {formatearFecha(fecha)}
          </span>
          {mostrarBadgeFinalizado && (
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                backgroundColor: 'rgba(62, 16, 15, 0.1)',
                color: '#3E100F',
                border: '1px solid rgba(62, 16, 15, 0.25)',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}
            >
              Finalizado
            </span>
          )}
        </div>
        <span className="small text-muted text-nowrap" style={{ fontSize: '0.8rem' }}>
          {cantAsist} cupos
        </span>
      </div>

      <div className="card-body px-3 py-2">
        <h5 className="card-title fw-bold mb-2" style={{ color: 'var(--titulos, #3E100F)', fontSize: '1.05rem' }}>
          {nombre}
        </h5>
        <p className="card-text text-secondary small" style={{ lineHeight: '1.4' }}>
          {descripcion || 'Sin descripción disponible.'}
        </p>
      </div>

      {/* Botones de acción en el panel de gestión */}
      {esGestion && (
        <div className="card-footer bg-light border-0 p-2.5 d-flex gap-2 justify-content-end">
          <button
            onClick={() => onEditar && onEditar(evento)}
            className="btn btn-sm d-flex align-items-center gap-1 px-3 shadow-sm rounded-2"
            style={{ 
              backgroundColor: '#f9f9f9', 
              color: 'var(--detalles, #64141B)', 
              border: '1px solid var(--bordes, #987C65)',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            Editar
          </button>
          <button
            onClick={() => onCambiarEstado && onCambiarEstado(id)}
            onMouseEnter={() => setHoverBotonEstado(true)}
            onMouseLeave={() => setHoverBotonEstado(false)}
            className="btn btn-sm d-flex align-items-center gap-1 px-3 shadow-sm rounded-2"
            style={{ 
              border: '1px solid var(--titulos, #3E100F)',
              backgroundColor: hoverBotonEstado ? 'var(--titulos, #3E100F)' : 'transparent',
              color: hoverBotonEstado ? '#ffffff' : 'var(--titulos, #3E100F)',
              fontSize: '0.85rem',
              fontWeight: '700',
              transition: 'all 0.2s ease'
            }}
          >
            {estaActivo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EventoCard;