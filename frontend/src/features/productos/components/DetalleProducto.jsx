import React from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../../shared/utils/formato';

const FALLBACK_IMAGEN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'><rect width='100%' height='100%' fill='%23F3EFEA'/><text x='50%' y='50%' fill='%23B5865A' font-family='sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>Sin Imagen</text></svg>";

function DetalleProducto({ producto, onAgregar }) {
    if (!producto) return null;

    // Sincronización de atributos de PostgreSQL (p_) con props simples
    const id = producto.p_id ?? producto.id;
    const marca = producto.p_marca ?? producto.marca ?? '';
    const tipo = producto.p_tipo ?? producto.tipo ?? '';
    const precio = producto.p_precio ?? producto.precio ?? 0;
    const anio = producto.p_anio ?? producto.anio ?? '';
    const medida = producto.p_medida ?? producto.medida ?? '';
    const varietal = producto.p_varietal ?? producto.varietal ?? '';
    const bodega = producto.p_bodega ?? producto.bodega ?? '';
    const descripcion = producto.p_descripcion ?? producto.descripcion ?? '';
    const img = producto.p_imagen_url ?? producto.p_img ?? producto.img ?? FALLBACK_IMAGEN;

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = FALLBACK_IMAGEN;
    };

    return (
        <div className="row g-4 g-lg-5">
            <div className="col-md-6">
                <img 
                    src={img || FALLBACK_IMAGEN} 
                    className="imagen-detalle w-100 rounded-3 shadow-sm" 
                    alt={marca || 'Producto'} 
                    onError={handleImageError}
                    style={{border: '2px solid var(--detalles, #B5865A)'}}
                />
            </div>

            <div className="col-md-6">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/catalogo" className="link-dark text-decoration-none">
                                Catálogo
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {marca} {varietal ? `(${varietal})` : ''}
                        </li>
                    </ol>
                </nav>

                {tipo && (
                    <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A' }}>
                        {tipo}
                    </span>
                )}
        
                <h1 className="h2 fw-bold" style={{ color: '#3E100F' }}>
                    {marca} {varietal ? `- ${varietal}` : ''}
                </h1> 
                
                <p className="fs-3 fw-bold my-3" style={{ color: '#3E100F' }}>
                    {typeof formatearPrecio === 'function' ? formatearPrecio(precio) : `$${precio}`}
                </p>

                <div className="card-text text-muted mb-4 border-top pt-3">
                    {bodega && <p className="mb-1"><strong>Bodega:</strong> {bodega}</p>}
                    {varietal && <p className="mb-1"><strong>Varietal:</strong> {varietal}</p>}
                    {anio && <p className="mb-1"><strong>Año:</strong> {anio}</p>}
                    {medida && <p className="mb-1"><strong>Medida:</strong> {medida} ml</p>}
                </div>

                {descripcion && (
                    <div className="mb-4">
                        <h5 className="fw-bold mb-2" style={{ color: '#3E100F' }}>Descripción</h5>
                        <p className="text-muted">{descripcion}</p>
                    </div>
                )}

                {onAgregar && (
                    <button 
                        onClick={() => onAgregar(producto)} 
                        className="btn text-white fw-semibold px-4 py-2 rounded-2"
                        style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
                    >
                        🛒 Agregar al Carrito
                    </button>
                )}
            </div>
        </div>
    );
}

export default DetalleProducto;