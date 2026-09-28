import { Link } from 'react-router-dom'
import { formatearPrecio } from '../../../shared/utils/formato'

function DetalleProducto({ producto, onAgregar }) {
    return (
        <div className="row g-4 g-lg-5">
            <div className="col-md-6">
                <img src={producto.img} className="imagen-detalle" alt={producto.marca} />
            </div>

            <div className="col-md-6">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/catalogo" className="link-dark">
                                Catálogo
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {producto.marca} {producto.varietal}
                        </li>
                    </ol>
                </nav>

                <span className="badge text-bg-light text-uppercase mb-2">{producto.tipo}</span>
        
                <h1 className="h2">{producto.marca} - {producto.varietal}</h1> 
                <p className="fs-3 fw-bold">{formatearPrecio(producto.precio)}</p>

                <div className="card-text text-muted mb-4">
                    <p className="mb-1"><strong>Bodega:</strong> {producto.bodega}</p>
                    <p className="mb-1"><strong>Varietal:</strong> {producto.varietal}</p>
                    <p className="mb-1"><strong>Año:</strong> {producto.anio}</p>
                    <p className="mb-1"><strong>Medida:</strong> {producto.medida} ml</p>
                </div>

                {/* Descripción del producto */}
                <div className="mb-4">
                    <h5 className="fw-bold mb-2">Descripción</h5>
                    <p className="text-muted">{producto.descripcion}</p>
                </div>
            </div>
        </div>
    )
}

export default DetalleProducto