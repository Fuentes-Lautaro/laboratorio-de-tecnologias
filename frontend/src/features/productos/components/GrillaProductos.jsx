import CardProducto from '../components/ProductoCard'

function GrillaProductos({ productos, onAgregar}) {
    return (
        <div className="row g-4">
            {productos.map((producto) => (
                <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                    <CardProducto producto={producto} onAgregar={onAgregar} />
                </div>
            ))}
        </div>
    )
}

export default GrillaProductos