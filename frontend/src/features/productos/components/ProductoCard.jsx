// Fallback limpio que solo se activa si la foto no existe
const FALLBACK_IMAGEN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'><rect width='100%' height='100%' fill='%23F3EFEA'/><text x='50%' y='50%' fill='%23B5865A' font-family='sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>Sin Imagen</text></svg>";

export function ProductoCard({ producto, esGestion = false, onVer, onEditar, onEliminar }) {
  const { 
    id, 
    marca, 
    tipo, 
    precio, 
    costo,
    stock, 
    img, 
    descripcion, 
    bodega, 
    varietal, 
    anio, 
    medida 
  } = producto;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGEN;
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="row g-0 h-100">
        {/* Columna de la Imagen (Izquierda) */}
        <div 
            className="col-4 d-flex justify-content-center align-items-center p-0" 
            style={{ backgroundColor: '#F3EFEA', overflow: 'hidden', height: '100%' }}
        >
            <img
                src={img || FALLBACK_IMAGEN}
                alt={marca || tipo || 'Producto'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={handleImageError}
            />
        </div>

        {/* Columna de los Datos (Derecha) */}
        <div className="col-8 d-flex flex-column">
          <div className="card-header bg-transparent border-0 pt-2 px-3 pb-0 d-flex justify-content-between align-items-center">
            <span 
              className="badge rounded-pill px-2.5 py-1" 
              style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', fontSize: '0.75rem' }}
            >
              {tipo || bodega || 'Vino'} {anio ? `(${anio})` : ''}
            </span>
            
            {esGestion && (
              <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
                📦 Stock: {stock}
              </span>
            )}
          </div>

          <div className="card-body px-3 py-2 flex-grow-1">
            <h5 className="card-title fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)', fontSize: '1.05rem' }}>
              {marca} {varietal ? `- ${varietal}` : ''} {medida ? `(${medida})` : ''}
            </h5>
            
            {bodega && (
              <h6 className="text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                Bodega: {bodega}
              </h6>
            )}

            {!esGestion && (
              <p className="card-text text-secondary small mb-2" style={{ lineHeight: '1.4' }}>
                {descripcion || 'Sin descripción disponible.'}
              </p>
            )}

            {esGestion && costo && (
              <div className="text-muted small mb-1">
                <strong>Costo:</strong> {costo}
              </div>
            )}

            <div className="fw-bold mt-1" style={{ color: 'var(--titulos, #3E100F)', fontSize: '1.1rem' }}>
              {precio}
            </div>
          </div>

          {/* Botones de acción en el panel de gestión */}
          {esGestion && (
            <div className="card-footer bg-light border-0 p-2 d-flex gap-2 justify-content-end">
              {onVer && (
                <button
                  onClick={() => onVer(producto)}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  style={{ fontSize: '0.8rem' }}
                >
                  👁️ Ver
                </button>
              )}
              <button
                onClick={() => onEditar(producto)}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onEliminar(id)}
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;