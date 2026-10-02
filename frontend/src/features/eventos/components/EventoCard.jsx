export function EventoCard({ evento, esGestion = false, onEditar, onEliminar }) {
  const { nombre, fecha, descripcion, cantAsistentes, imagenUrl } = evento;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGEN;
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      {/* Portada del Evento */}
      <div style={{ height: '160px', backgroundColor: '#F3EFEA', overflow: 'hidden' }}>
        <img
          src={imagenUrl || FALLBACK_IMAGEN}
          alt={nombre}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={handleImageError}
        />
      </div>

      <div className="card-header bg-transparent border-0 pt-3 px-3 pb-0 d-flex justify-content-between align-items-center">
        <span 
          className="badge rounded-pill px-2.5 py-1" 
          style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', fontSize: '0.75rem' }}
        >
          📅 {fecha}
        </span>
        <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
          👥 {cantAsistentes} cupos
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
            onClick={() => onEditar(evento)}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem' }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onEliminar(evento.id)}
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem' }}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default EventoCard;