import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

// CLASE 3 · React Router: se usa en dos lugares de router.jsx
//  - path: '*'      → la URL no coincide con ninguna ruta (404)
//  - errorElement   → ocurrió un error al cargar o dibujar una ruta
function NoEncontradaPage() {
  const error = useRouteError() // undefined cuando se usa como ruta '*'
  const esErrorInesperado = Boolean(error) && !(isRouteErrorResponse(error) && error.status === 404)

  return (
    <div className="py-5 px-3 text-center">
      <p className="display-1 fw-bold text-body-tertiary">{esErrorInesperado ? 'Ups' : '404'}</p>
      <h1 className="h3 mb-3">{esErrorInesperado ? 'Algo salió mal' : 'Página no encontrada'}</h1>
      <p className="text-body-secondary mb-4">
        {esErrorInesperado
          ? 'Ocurrió un error inesperado. Probá volver al inicio.'
          : 'La dirección que buscás no existe o fue movida.'}
      </p>
      <Link to="/" className="btn btn-dark">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NoEncontradaPage
