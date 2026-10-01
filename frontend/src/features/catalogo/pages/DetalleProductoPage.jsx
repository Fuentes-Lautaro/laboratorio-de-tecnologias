import { Link, useOutletContext, useParams } from 'react-router'
import DetalleProducto from '../components/DetalleProducto'
import { getProductoPorId } from '../../productos/services/productosServices'
import { useFetch } from '../../../shared/hooks/useFetch'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'

function DetalleProductoPage() {
  const { id } = useParams()
  const { agregarProducto } = useOutletContext()
  const { datos: producto, cargando, error } = useFetch(getProductoPorId, id)

  if (cargando) return <Spinner texto="Cargando producto..." />

  if (error) {
    return (
      <MensajeVacio titulo="Producto no encontrado" texto={error.message}>
        <Link to="/catalogo" className="btn boton-error">
          Volver al catálogo
        </Link>
      </MensajeVacio>
    )
  }

  return <DetalleProducto key={producto.id} producto={producto} onAgregar={agregarProducto} />
}

export default DetalleProductoPage
