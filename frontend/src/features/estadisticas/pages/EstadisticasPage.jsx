import { useOutletContext } from 'react-router'
import TarjetaResumen from '../components/TarjetaResumen'
import { obtenerResumen } from '../services/estadisticasService'
import { useFetch } from '../../../shared/hooks/useFetch'
import Tarjeta from '../../../shared/components/Tarjeta'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import {formatearPrecio} from '../../../shared/utils/formato'

const COLOR_ESTADO = {
  pendiente: 'warning',
  enviado: 'info',
  entregado: 'success',
}

function EstadisticasPage() {
  const { usuario } = useOutletContext() || { usuario: { nombre: 'Usuario' } }
  const { datos: resumen, cargando, error } = useFetch(obtenerResumen)

  if (cargando) return <Spinner texto="Cargando resumen..." />
  if (error) return <MensajeVacio titulo="No pudimos cargar el resumen" texto={error.message} />

  return (
    <>
      <header className="mb-4">
        <h1 className="h3 mb-1">Hola, {usuario.nombre}</h1>
        <p className="text-body-secondary mb-0">Estadísticas del negocio</p>
      </header>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <TarjetaResumen titulo="Total de ingresos mensuales" valor={formatearPrecio(resumen.totalIngresosMensuales)} color="primary" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Suscripciones activas" valor={resumen.suscripcionesActivas} color="primary" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Clientes registrados" valor={resumen.clientesRegistrados} color="primary" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Plan más vendido" valor={resumen.planMasVendido} color="primary" />
        </div>
      </div>

    <div className="mb-4">
    <Tarjeta titulo="Distribución por Plan">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col" className="text-center">Suscripciones</th>
              <th scope="col" className="text-end">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {resumen.distribucionPorPlan.map((plan) => (
              <tr key={plan.planId}>
                <td>
                  <span className="fw-semibold">{plan.nombre}</span>
                </td>
                <td className="text-center">
                  <span className="badge text-bg-info">
                    {plan.cantidadSuscripciones}
                  </span>
                </td>
                <td className="text-end fw-bold">
                  {formatearPrecio(plan.ingresos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tarjeta>
    </div>

    <div className="mb-4">
    <Tarjeta titulo="Métodos de Pago Más Usados">
      <div className="d-flex flex-column gap-3">
        {resumen.metodosPagoMasUsados.map((item, index) => (
          <div key={index}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-medium">{item.metodo}</span>
              <small className="text-muted">
                {item.cantidad} ({item.porcentaje}%)
              </small>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${item.porcentaje}%` }}
                aria-valuenow={item.porcentaje}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Tarjeta>
    </div>
    </>
  )
}

export default EstadisticasPage