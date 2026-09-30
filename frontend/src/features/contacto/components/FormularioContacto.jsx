import { useRef, useState } from 'react'
import Boton from '../../../shared/components/Boton'
import { esEmailValido, esRequerido, tieneLongitudMinima } from '../../../shared/utils/validaciones'

const VALORES_INICIALES = {
  nombre: '',
  email: '',
  asunto: 'consulta',
  mensaje: '',
  aceptaNovedades: false,
}

const ASUNTOS = [
  { valor: 'consulta', texto: 'Consulta general' },
  { valor: 'subs', texto: 'Subscripciones' },
  { valor: 'envios', texto: 'Envíos a domicilio' },
]

const MAXIMO_MENSAJE = 500

// Función pura, fuera del componente: recibe los valores y devuelve los errores.
function validar(valores) {
  const errores = {}
  if (!esRequerido(valores.nombre)) errores.nombre = 'Ingresá tu nombre.'
  if (!esRequerido(valores.email)) errores.email = 'Ingresá tu email.'
  else if (!esEmailValido(valores.email)) errores.email = 'El formato del email no es válido.'
  if (!tieneLongitudMinima(valores.mensaje, 10)) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  return errores
}

// Simula el envío al servidor (todavía no existe): tarda 1,5 segundos.
function enviarMensaje(valores) {
  return new Promise((resolve) => setTimeout(() => resolve(valores), 1500))
}

function FormularioContacto() {
  // CLASE 3 · Formularios controlados: un objeto con todos los campos.
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})

  // CLASE 3 · Reaccionar a la entrada con el estado
  // En vez de varios booleanos (estaEnviando, fueEnviado...) que pueden
  // contradecirse, UN estado con los valores posibles: 'escribiendo' | 'enviando' | 'enviado'
  const [estado, setEstado] = useState('escribiendo')

  // CLASE 3 · Manipular el DOM con refs
  const formularioRef = useRef(null)

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    // Se crea un objeto NUEVO copiando el anterior (nunca valores[name] = value).
    setValores({ ...valores, [name]: type === 'checkbox' ? checked : value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  async function handleSubmit(e) {
    e.preventDefault() // evita que el navegador recargue la página

    const nuevosErrores = validar(valores)
    setErrores(nuevosErrores)

    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) {
      // El ref da acceso al <form> real del DOM para llevar el foco al campo con error.
      formularioRef.current.elements[primerCampoConError].focus()
      return
    }

    setEstado('enviando')
    await enviarMensaje(valores)
    setEstado('enviado')
  }

  function handleNuevoMensaje() {
    setValores(VALORES_INICIALES)
    setEstado('escribiendo')
  }

  if (estado === 'enviado') {
    return (
      <div className="alert alert-success mb-0" role="status">
        <h2 className="h5">¡Gracias, {valores.nombre}!</h2>
        <p>Recibimos tu mensaje y te vamos a responder a {valores.email}.</p>
        <Boton variante="success" onClick={handleNuevoMensaje}>
          Enviar otro mensaje
        </Boton>
      </div>
    )
  }

  const enviando = estado === 'enviando'

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
          value={valores.nombre}
          onChange={handleChange}
          disabled={enviando}
        />
        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`form-control ${errores.email ? 'is-invalid' : ''}`}
          value={valores.email}
          onChange={handleChange}
          disabled={enviando}
        />
        {errores.email && <div className="invalid-feedback">{errores.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="asunto" className="form-label">
          Asunto
        </label>
        <select id="asunto" name="asunto" className="form-select" value={valores.asunto} onChange={handleChange} disabled={enviando}>
          {ASUNTOS.map((asunto) => (
            <option key={asunto.valor} value={asunto.valor}>
              {asunto.texto}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="mensaje" className="form-label">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          maxLength={MAXIMO_MENSAJE}
          className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
          value={valores.mensaje}
          onChange={handleChange}
          disabled={enviando}
        ></textarea>
        {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
        {/* Dato derivado: el contador se calcula, no se guarda */}
        <div className="form-text text-end">
          {valores.mensaje.length}/{MAXIMO_MENSAJE}
        </div>
      </div>

      <div className="form-check mb-4">
        <input
          id="aceptaNovedades"
          name="aceptaNovedades"
          type="checkbox"
          className="form-check-input"
          checked={valores.aceptaNovedades}
          onChange={handleChange}
          disabled={enviando}
        />
        <label htmlFor="aceptaNovedades" className="form-check-label">
          Quiero recibir novedades y promociones
        </label>
      </div>

      <Boton type="submit" variante="dark" className="w-100" disabled={enviando}>
        {enviando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </Boton>
    </form>
  )
}

export default FormularioContacto