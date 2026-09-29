import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

function NoEncontradaPage() {
  const error = useRouteError()
  const esErrorInesperado = Boolean(error) && !(isRouteErrorResponse(error) && error.status === 404)

  return (
    <div className="py-5 px-3 text-center">
      <p className="display-1 fw-bold text-body-tertiary">{esErrorInesperado ? 'Ups' : '404'}</p>
      <h1 className="h3 mb-3 titulo-noEncontrada">{esErrorInesperado ? 'Algo salió mal' : 'Página no encontrada'}</h1>
      <p className=" mb-4 texto-noEncontrada">
        {esErrorInesperado
          ? 'Ocurrió un error inesperado. Probá volver al inicio.'
          : 'La dirección que buscás no existe o fue movida.'}
      </p>
      <Link to="/" className="btn boton-error">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NoEncontradaPage
