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

import { 
  getSuscripcionActivaPorDni, 
  getPlanPorNombre, 
  crearPreferenciaSuscripcion 
} from '../services/suscripcionesService';

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

  // Helper para comprobar si entre sus suscripciones ya tiene activo el plan elegido
  const buscarMismoPlanActivo = (suscripciones, planActual) => {
    if (!Array.isArray(suscripciones)) return null;
    const nombreUrl = decodeURIComponent(nombre || '').trim().toLowerCase();

    return suscripciones.find((sub) => {
      if (!sub.activo) return false;
      if (planActual?.id && Number(sub.plan_id) === Number(planActual.id)) return true;
      return sub.plan_nombre && sub.plan_nombre.trim().toLowerCase() === nombreUrl;
    }) || null;
  };

  // Verificar sesión previa al cargar el componente
  useEffect(() => {
    async function verificarSesionInicial() {
      const sesionActiva = obtenerSesion();

      if (sesionActiva) {
        setClienteLogueado(sesionActiva);
        setEmail(sesionActiva.email || sesionActiva.mail || '');
        setCargando(true);

        try {
          const suscripciones = await getSuscripcionActivaPorDni();
          const mismoPlanActivo = buscarMismoPlanActivo(suscripciones, planSeleccionado);

          if (mismoPlanActivo) {
            setSuscripcionExistente(mismoPlanActivo);
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
      }
    }

    verificarSesionInicial();
  }, [planSeleccionado]);

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

      const suscripciones = await getSuscripcionActivaPorDni();
      const mismoPlanActivo = buscarMismoPlanActivo(suscripciones, planSeleccionado);

      if (mismoPlanActivo) {
        setSuscripcionExistente(mismoPlanActivo);
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

  const handleRegistro = async (datosRegistro) => {
    setCargando(true);
    setErrorBackend('');

    try {
      const payloadRegistro = {
        ...datosRegistro,
        mail: email
      };

      await registrarCliente(payloadRegistro);
      
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

    try {
      const planId = planSeleccionado?.id || planSeleccionado?.ps_id;
      const { init_point } = await crearPreferenciaSuscripcion(planId);

      if (!init_point) {
        throw new Error('Mercado Pago no devolvió una URL de pago válida.');
      }

      // Redirigimos al Checkout Pro oficial de Mercado Pago
      window.location.href = init_point;
    } catch (error) {
      setErrorBackend(error.message || 'Error al iniciar el pago con Mercado Pago.');
      setCargando(false);
    }
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
            <h4 className="text-warning fw-bold mb-3">¡Ya tenés este plan activo!</h4>
            <p className="text-muted small mb-3">
              Hola <strong>{clienteLogueado?.nombre || 'Usuario'}</strong>, detectamos que tu cuenta ya posee una suscripción activa para este plan.
            </p>
            <div className="alert alert-light border text-start small mb-3">
              <div><strong>Plan:</strong> {suscripcionExistente?.plan_nombre || suscripcionExistente?.planId}</div>
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