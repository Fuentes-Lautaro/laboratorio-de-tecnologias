import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useRevalidator } from 'react-router-dom';

import { 
  CardIngresoEmail, 
  CardIngresoContrasenia, 
  CardRegistro, 
  verificarEmailExistente,
  iniciarSesion,
  registrarCliente,
  obtenerSesion
} from '../../auth';

import { CardPagarSuscripcion } from '../components/CardPagarSuscripcion';
import { getSuscripcionActivaPorDni, getPlanPorNombre } from '../services/suscripcionesService';

export function FlujoSuscripcionPage() {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [paso, setPaso] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [clienteLogueado, setClienteLogueado] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [suscripcionExistente, setSuscripcionExistente] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');

  // Cargar datos del plan elegido desde el parámetro URL
  useEffect(() => {
    async function cargarPlan() {
      if (!nombre) return;
      try {
        const plan = await getPlanPorNombre(nombre);
        setPlanSeleccionado(plan);
      } catch (err) {
        console.error('Error al cargar datos del plan:', err);
      }
    }
    cargarPlan();
  }, [nombre]);

  // Verificar sesión previa al cargar el componente
  useEffect(() => {
    async function verificarSesionInicial() {
      const sesionActiva = obtenerSesion();

      if (sesionActiva) {
        setClienteLogueado(sesionActiva);
        setEmail(sesionActiva.email || sesionActiva.mail || '');

        const identificador = sesionActiva.dni || sesionActiva.email;
        
        if (identificador) {
          setCargando(true);
          try {
            const subActiva = await getSuscripcionActivaPorDni(identificador);
            if (subActiva) {
              setSuscripcionExistente(subActiva);
              setPaso('SUSCRIPTO');
            } else {
              setPaso('PAGO');
            }
          } catch (error) {
            console.error('Error al verificar suscripción activa:', error);
            setPaso('PAGO');
          } finally {
            setCargando(false);
          }
        } else {
          setPaso('PAGO');
        }
      }
    }

    verificarSesionInicial();
  }, []);

  const handleVerificarEmail = async (emailIngresado) => {
    setCargando(true);
    setErrorBackend('');
    setEmail(emailIngresado);

    try {
      const resultado = await verificarEmailExistente(emailIngresado);
      const existe = typeof resultado === 'object' ? resultado.existe : resultado;

      if (existe) {
        setPaso('PASSWORD');
      } else {
        setPaso('REGISTRO');
      }
    } catch (error) {
      setErrorBackend(error.message || 'Error al verificar el correo.');
    } finally {
      setCargando(false);
    }
  };

  const handleLogin = async (clave) => {
    setCargando(true);
    setErrorBackend('');

    try {
      const sesion = await iniciarSesion(email, clave);
      setClienteLogueado(sesion);

      revalidator.revalidate();

      const identificador = sesion.dni || sesion.email;
      const subActiva = await getSuscripcionActivaPorDni(identificador);

      if (subActiva) {
        setSuscripcionExistente(subActiva);
        setPaso('SUSCRIPTO');
      } else {
        setPaso('PAGO');
      }
    } catch (error) {
      setErrorBackend(error.message || 'Email o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };

  // PASO 2B: Registro de nuevo usuario
  const handleRegistro = async (datosRegistro) => {
    setCargando(true);
    setErrorBackend('');

    try {
      const payloadRegistro = {
        ...datosRegistro,
        mail: email
      };

      const nuevoCliente = await registrarCliente(payloadRegistro);
      
      const sesion = await iniciarSesion(email, datosRegistro.password);
      setClienteLogueado(sesion);

      revalidator.revalidate();

      setPaso('PAGO');
    } catch (error) {
      setErrorBackend(error.message || 'Error al completar el registro.');
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarPago = async () => {
    setCargando(true);
    setErrorBackend('');

    setTimeout(() => {
      setCargando(false);

      alert(
        `¡Pago procesado con éxito!\n\n` +
        `Plan: ${planSeleccionado?.nombre || 'Suscripción'}\n` +
        `Monto: $${planSeleccionado?.valor?.toLocaleString('es-AR')}\n` +
        `Titular: ${clienteLogueado?.nombre || email}`
      );

      navigate('/');
    }, 1500);
  };

  return (
    <section className="container py-5 d-flex justify-content-center">
      <div className="card-flow-contenedor" style={{ maxWidth: '450px', width: '100%' }}>
        
        <div className="resumen-mini-plan mb-4 text-center">
          <span className="subtitulo-tag">Plan Seleccionado</span>
          <h2 style={{ color: 'var(--titulos, #4a1525)' }}>
            {planSeleccionado ? planSeleccionado.nombre : decodeURIComponent(nombre || 'Suscripción')}
          </h2>
        </div>

        {errorBackend && (
          <div className="alert alert-danger py-2 mb-3 text-center" role="alert">
            {errorBackend}
          </div>
        )}

        {paso === 'EMAIL' && (
          <CardIngresoEmail
            onVerificarEmail={handleVerificarEmail}
            cargando={cargando}
          />
        )}

        {paso === 'PASSWORD' && (
          <CardIngresoContrasenia
            email={email}
            onLogin={handleLogin}
            onVolver={() => setPaso('EMAIL')}
            cargando={cargando}
            errorBackend={errorBackend}
          />
        )}

        {paso === 'REGISTRO' && (
          <CardRegistro
            email={email}
            onRegistro={handleRegistro}
            onVolver={() => setPaso('EMAIL')}
            cargando={cargando}
            errorBackend={errorBackend}
          />
        )}

        {paso === 'SUSCRIPTO' && (
          <div className="card shadow-sm border-0 p-4 text-center">
            <h4 className="text-warning fw-bold mb-3">¡Ya tenés una suscripción!</h4>
            <p className="text-muted small mb-3">
              Hola <strong>{clienteLogueado?.nombre || 'Usuario'}</strong>, detectamos que tu cuenta ya posee una suscripción activa.
            </p>
            <div className="alert alert-light border text-start small mb-3">
              <div><strong>Plan:</strong> {suscripcionExistente?.planId}</div>
              <div><strong>Estado:</strong> {suscripcionExistente?.estado}</div>
              <div><strong>Fecha de pago:</strong> {suscripcionExistente?.fechaPago}</div>
            </div>
            <button className="btn btn-outline-dark btn-sm w-100" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        )}

        {paso === 'PAGO' && (
          <CardPagarSuscripcion
            plan={planSeleccionado}
            cliente={clienteLogueado}
            onConfirmarPago={handleConfirmarPago}
            onVolver={() => navigate('/suscripciones')}
            cargando={cargando}
          />
        )}

      </div>
    </section>
  );
}

export default FlujoSuscripcionPage;