import { useEffect, useState } from 'react'

export function useFetch(servicio, parametro) {
  const [respuesta, setRespuesta] = useState({
    servicio: null,
    parametro: undefined,
    datos: null,
    error: null,
  })

  useEffect(() => {
    let ignorar = false

    servicio(parametro)
      .then((datos) => {
        if (!ignorar) setRespuesta({ servicio, parametro, datos, error: null })
      })
      .catch((error) => {
        if (!ignorar) setRespuesta({ servicio, parametro, datos: null, error })
      })

    return () => {
      ignorar = true
    }
  }, [servicio, parametro])

  const cargando = respuesta.servicio !== servicio || respuesta.parametro !== parametro

  return {
    datos: cargando ? null : respuesta.datos,
    error: cargando ? null : respuesta.error,
    cargando,
  }
}
