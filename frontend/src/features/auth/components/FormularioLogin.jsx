import { useRef, useState } from 'react'
import { esEmailValido, esRequerido } from '../../../shared/utils/validaciones'

function validar(valores) {
  const errores = {}
  if (!esRequerido(valores.email)) errores.email = 'Ingresá tu email.'
  else if (!esEmailValido(valores.email)) errores.email = 'El formato del email no es válido.'
  if (!esRequerido(valores.password)) errores.password = 'Ingresá tu contraseña.'
  return errores
}

export function FormularioLogin({ onIngresar }) {
  const [valores, setValores] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const formularioRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
    setErrorServidor('')
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

    setEnviando(true)
    setErrorServidor('')

    try {
      await onIngresar(valores)
    } catch (error) {
      // 1. Captura el mensaje "Credenciales inválidas" que devuelve Express
      setErrorServidor(error.message || 'Credenciales inválidas.')
    } finally {
      setEnviando(false) // 2. Devuelve el botón a estado "Ingresar"
    }
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate className="p-1">
      
      {/* 👈 ESTA ES LA ALERTA QUE FALTABA EN EL JSX */}
      {errorServidor && (
        <div className="alert alert-danger text-center small rounded-3 py-2 mb-3" role="alert">
          {errorServidor}
        </div>
      )}

      {/* Campo Email */}
      <div className="mb-3">
        <label 
          htmlFor="email" 
          className="form-label fw-bold small text-uppercase mb-1" 
          style={{ color: 'var(--texto, #21140E)', letterSpacing: '0.5px', fontSize: '0.75rem' }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          className={`form-control ${errores.email ? 'is-invalid' : ''}`}
          value={valores.email}
          onChange={handleChange}
          disabled={enviando}
          placeholder="ejemplo@mariabalbina.com"
          style={{
            borderColor: errores.email ? '#dc3545' : 'var(--bordes, #987C65)',
            backgroundColor: '#ffffff',
            padding: '0.65rem 0.9rem'
          }}
        />
        {errores.email && (
          <div className="invalid-feedback small fw-semibold mt-1">
            {errores.email}
          </div>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="mb-4">
        <label 
          htmlFor="password" 
          className="form-label fw-bold small text-uppercase mb-1" 
          style={{ color: 'var(--texto, #21140E)', letterSpacing: '0.5px', fontSize: '0.75rem' }}
        >
          Contraseña
        </label>
        <div className="input-group has-validation">
          <input
            id="password"
            name="password"
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`form-control ${errores.password ? 'is-invalid' : ''}`}
            value={valores.password}
            onChange={handleChange}
            disabled={enviando}
            placeholder="••••••••"
            style={{
              borderColor: errores.password ? '#dc3545' : 'var(--bordes, #987C65)',
              backgroundColor: '#ffffff',
              padding: '0.65rem 0.9rem'
            }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary px-3"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            aria-pressed={mostrarPassword}
            disabled={enviando}
            style={{
              borderColor: 'var(--bordes, #987C65)',
              color: 'var(--paneles, #3E100F)',
              backgroundColor: 'rgba(181, 134, 90, 0.08)',
              fontWeight: '500',
              fontSize: '0.85rem'
            }}
          >
            {mostrarPassword ? 'Ocultar' : 'Mostrar'}
          </button>
          {errores.password && (
            <div className="invalid-feedback small fw-semibold mt-1">
              {errores.password}
            </div>
          )}
        </div>
      </div>

      {/* Botón Principal */}
      <button 
        type="submit" 
        className="btn w-100 py-2.5 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 shadow-sm" 
        disabled={enviando}
        style={{
          backgroundColor: 'var(--paneles, #3E100F)',
          color: 'var(--fondos-principales, #F9EBE0)',
          border: '1px solid var(--titulos, #64141B)',
          letterSpacing: '1px',
          fontSize: '0.9rem'
        }}
      >
        {enviando ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
            <span>Verificando...</span>
          </>
        ) : (
          <span>Ingresar</span>
        )}
      </button>

    </form>
  )
}

export default FormularioLogin