import CardProductos from './CardProductos'

function GrillaProductos({ productos, onAgregar}) {
    return (
        <div>
            {productos.map((producto) => (
                <div>
                    <TarjetaProducto producto={producto} onAgregar={onAgregar} />
                </div>
            ))}
        </div>
    )
}

export default GrillaProductos