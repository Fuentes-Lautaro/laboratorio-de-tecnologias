// Fallback limpio que solo se activa si la foto no existe
const FALLBACK_IMAGEN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'><rect width='100%' height='100%' fill='%23F3EFEA'/><text x='50%' y='50%' fill='%23B5865A' font-family='sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>Sin Imagen</text></svg>";

export function EventoCard({ evento, esGestion = false, onEditar, onEliminar }) {
  const { nombre, fecha, descripcion, cantAsistentes, imagenUrl } = evento;

  const handleImageError = (e) => {
    e.target.onerror = null; // Evita bucles infinitos en consola
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