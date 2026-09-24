import { Link } from 'react-router'

function CardProducto ( {producto, onAgregar }) {
    const sinStock = producto.stock === 0

    return (
        <article>
            <span className="ojal" aria-hidden="true"></span>
        </article>
    )
}

export default CardProducto