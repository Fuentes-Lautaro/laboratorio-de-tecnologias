import { useRef, useState } from 'react'
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

function validar(valores) {
  const errores = {}
  if (!esRequerido(valores.nombre)) errores.nombre = 'Ingresá tu nombre.'
  if (!esRequerido(valores.email)) errores.email = 'Ingresá tu email.'
  else if (!esEmailValido(valores.email)) errores.email = 'El formato del email no es válido.'
  if (!tieneLongitudMinima(valores.mensaje, 10)) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  return errores
}

function enviarMensaje(valores) {
  return new Promise((resolve) => setTimeout(() => resolve(valores), 1500))
}

function FormularioContacto() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setValores({ ...valores, [name]: type === 'checkbox' ? checked : value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nuevosErrores = validar(valores)
    setErrores(nuevosErrores)

    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) {
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
      <div className="alert border-0 shadow-sm p-4 text-center mb-0" style={{ backgroundColor: 'rgba(181, 134, 90, 0.1)' }} role="status">
        <span style={{ fontSize: '2.5rem' }}>✨</span>
        <h2 className="h5 fw-bold mt-2" style={{ color: '#3E100F' }}>¡Gracias, {valores.nombre}!</h2>
        <p className="text-secondary small mb-3">Recibimos tu mensaje y te vamos a responder a la brevedad a <strong>{valores.email}</strong>.</p>
        <button 
          type="button" 
          className="btn px-4 py-2 text-white fw-semibold rounded-pill shadow-sm"
          style={{ backgroundColor: '#3E100F', border: 'none' }}
          onClick={handleNuevoMensaje}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const enviando = estado === 'enviando'

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      
      {/* Campo Nombre */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label fw-semibold small" style={{ color: '#3E100F' }}>
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`form-control shadow-none ${errores.nombre ? 'is-invalid' : ''}`}
          style={{ borderColor: errores.nombre ? undefined : '#dee2e6' }}
          value={valores.nombre}
          onChange={handleChange}
          disabled={enviando}
          placeholder="Tu nombre completo"
        />
        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
      </div>

      {/* Campo Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold small" style={{ color: '#3E100F' }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`form-control shadow-none ${errores.email ? 'is-invalid' : ''}`}
          value={valores.email}
          onChange={handleChange}
          disabled={enviando}
          placeholder="tu@email.com"
        />
        {errores.email && <div className="invalid-feedback">{errores.email}</div>}
      </div>

      {/* Campo Asunto */}
      <div className="mb-3">
        <label htmlFor="asunto" className="form-label fw-semibold small" style={{ color: '#3E100F' }}>
          Asunto
        </label>
        <select 
          id="asunto" 
          name="asunto" 
          className="form-select shadow-none" 
          value={valores.asunto} 
          onChange={handleChange} 
          disabled={enviando}
        >
          {ASUNTOS.map((asunto) => (
            <option key={asunto.valor} value={asunto.valor}>
              {asunto.texto}
            </option>
          ))}
        </select>
      </div>

      {/* Campo Mensaje */}
      <div className="mb-3">
        <label htmlFor="mensaje" className="form-label fw-semibold small" style={{ color: '#3E100F' }}>
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          maxLength={MAXIMO_MENSAJE}
          className={`form-control shadow-none ${errores.mensaje ? 'is-invalid' : ''}`}
          value={valores.mensaje}
          onChange={handleChange}
          disabled={enviando}
          placeholder="Escribinos tu consulta..."
        ></textarea>
        {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
        <div className="form-text text-end text-muted small">
          {valores.mensaje.length}/{MAXIMO_MENSAJE}
        </div>
      </div>

      {/* Checkbox Novedades */}
      <div className="form-check mb-4">
        <input
          id="aceptaNovedades"
          name="aceptaNovedades"
          type="checkbox"
          className="form-check-input shadow-none"
          checked={valores.aceptaNovedades}
          onChange={handleChange}
          disabled={enviando}
          style={{ cursor: 'pointer' }}
        />
        <label htmlFor="aceptaNovedades" className="form-check-label text-secondary small" style={{ cursor: 'pointer' }}>
          Quiero recibir novedades y promociones exclusivas
        </label>
      </div>

      {/* Botón de Enviar */}
      <button
        type="submit"
        className="btn w-100 py-2 text-white fw-semibold shadow-sm rounded-2 transition-all"
        style={{ backgroundColor: '#3E100F', border: 'none' }}
        disabled={enviando}
      >
        {enviando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Enviando consulta...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>

    </form>
  )
}

export default FormularioContacto