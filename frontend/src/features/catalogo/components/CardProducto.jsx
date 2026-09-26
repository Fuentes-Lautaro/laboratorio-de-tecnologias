import { Link } from 'react-router-dom'

function CardProducto({ producto, onAgregar }) {
  const sinStock = producto.stock === 0

  return (
    <article className="card h-100 shadow-sm producto-card">
        <div className="card-body d-flex flex-column p-3">

            <div className="simagen-envoltorio imagen-card text-center">
                <Link to={`/catalogo/${producto.id}`}>
                    <img src={producto.img} className="card-img-top" alt={producto.marca} />
                </Link>
                <span className="badge categoria-chip text-uppercase">{producto.categoria}</span>
            </div>

            <h3 className="h4 mb-2 fs-2">
                <Link to={`/catalogo/${producto.id}`} className="text-decoration-none titulo-card">
                    {producto.marca}
                </Link>
            </h3>

            <div className="card-text text-muted small mb-2 info-card">
                <p className="mb-1">Bodega: {producto.bodega}</p>
                <p className="mb-1">Cepa: {producto.tipo}</p>
                <p className="mb-1">Varietal: {producto.varietal}</p>
                <p className="mb-1">{producto.medida}ml</p>
            </div>
            
            {sinStock && (
                <div className='mt-auto d-flex justify-content-end align-items-center'>
                    <span className="sinStock-mensaje badge">Sin stock</span>
                </div>
            )}
        </div>
    </article>
  )
}

export default CardProducto
