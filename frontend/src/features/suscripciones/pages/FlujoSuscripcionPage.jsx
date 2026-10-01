import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  CardIngresoEmail, 
  CardIngresoPassword, 
  CardRegistro, 
  verificarEmailExistente,
  iniciarSesion 
} from '../../auth';

import { CardPagarSuscripcion } from '../components/CardPagarSuscripcion';
import { getSuscripcionActivaPorDni, getPlanPorNombre } from '../services/suscripcionesService';

export function FlujoSuscripcionPage() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  const [paso, setPaso] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [clienteLogueado, setClienteLogueado] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [suscripcionExistente, setSuscripcionExistente] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');

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

  const handleVerificarEmail = async (emailIngresado) => {
    setCargando(true);
    setErrorBackend('');
    setEmail(emailIngresado);

    try {
      const existe = await verificarEmailExistente(emailIngresado);
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

      const subActiva = await getSuscripcionActivaPorDni(sesion.dni);

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

  const handleRegistro = async (datosRegistro) => {
    setCargando(true);
    setErrorBackend('');

    try {
      const nuevoCliente = { ...datosRegistro, email };
      setClienteLogueado(nuevoCliente);
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
          <CardIngresoPassword
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
            cargando={cargando}
            errorBackend={errorBackend}
          />
        )}

        {paso === 'SUSCRIPTO' && (
          <div className="card shadow-sm border-0 p-4 text-center">
            <h4 className="text-warning fw-bold mb-3">¡Ya tenés una suscripción!</h4>
            <p className="text-muted small mb-3">
              Hola <strong>{clienteLogueado?.nombre}</strong>, detectamos que tu cuenta ya posee una suscripción activa.
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
            onVolver={() => setPaso('PASSWORD')}
            cargando={cargando}
          />
        )}

      </div>
    </section>
  );
}

export default FlujoSuscripcionPage;