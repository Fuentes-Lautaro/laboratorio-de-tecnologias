import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Importaciones del módulo Auth
import { 
  CardIngresoEmail, 
  CardIngresoPassword, 
  CardRegistro, 
  verificarEmailExistente,
  iniciarSesion 
} from '../../auth';

// Importaciones de Suscripciones (Rutas corregidas con ../)
import { CardPagarSuscripcion } from '../components/CardPagarSuscripcion';
import { getSuscripcionActivaPorDni, getPlanesPorNombre } from '../services/suscripcionesService';

export function FlujoSuscripcionPage() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  // Estados del flujo: 'EMAIL' | 'PASSWORD' | 'REGISTRO' | 'PAGO' | 'SUSCRIPTO'
  const [paso, setPaso] = useState('EMAIL');
  
  // Estados de datos
  const [email, setEmail] = useState('');
  const [clienteLogueado, setClienteLogueado] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [suscripcionExistente, setSuscripcionExistente] = useState(null);

  // Estados de interfaz
  const [cargando, setCargando] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');

  // 1. Cargar el plan dinámicamente desde la URL
  useEffect(() => {
    async function cargarPlan() {
      if (!nombre) return;
      try {
        const plan = await getPlanesPorNombre(nombre);
        setPlanSeleccionado(plan);
      } catch (err) {
        console.error('Error al cargar datos del plan:', err);
      }
    }
    cargarPlan();
  }, [nombre]);

  // PASO 1: Verificar si el mail existe en clientes.json
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

  // PASO 2A: Login y consulta de suscripción activa por DNI
  const handleLogin = async (clave) => {
    setCargando(true);
    setErrorBackend('');

    try {
      // Autenticar credenciales
      const sesion = await iniciarSesion(email, clave);
      setClienteLogueado(sesion);

      // Verificar en suscripciones.json si ya tiene suscripción activa
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

  // PASO 2B: Registro de cliente nuevo
  const handleRegistro = async (datosRegistro) => {
    setCargando(true);
    setErrorBackend('');

    try {
      const nuevoCliente = { ...datosRegistro, email };
      setClienteLogueado(nuevoCliente);
      // Un usuario registrado recién no tiene suscripción previa, pasa a pagar directamente
      setPaso('PAGO');
    } catch (error) {
      setErrorBackend(error.message || 'Error al completar el registro.');
    } finally {
      setCargando(false);
    }
  };

  // PASO 3: Confirmar Pago (Simulación de 1.5 segundos sin API externa)
  const handleConfirmarPago = async (datosPago) => {
    setCargando(true);
    setErrorBackend('');

    setTimeout(() => {
      setCargando(false);

      alert(
        `¡Pago procesado con éxito!\n\n` +
        `Plan: ${planSeleccionado?.Nombre || 'Suscripción'}\n` +
        `Monto: $${planSeleccionado?.valor?.toLocaleString('es-AR')}\n` +
        `Titular: ${clienteLogueado?.nombre || email}`
      );

      navigate('/');
    }, 1500);
  };

  return (
    <section className="container py-5 d-flex justify-content-center">
      <div className="card-flow-contenedor" style={{ maxWidth: '450px', width: '100%' }}>
        
        {/* Cabecera dinámica */}
        <div className="resumen-mini-plan mb-4 text-center">
          <span className="subtitulo-tag">Plan Seleccionado</span>
          <h2 style={{ color: 'var(--titulos, #4a1525)' }}>
            {planSeleccionado ? planSeleccionado.Nombre : decodeURIComponent(nombre || 'Suscripción')}
          </h2>
        </div>

        {/* Notificaciones de error */}
        {errorBackend && (
          <div className="alert alert-danger py-2 mb-3 text-center" role="alert">
            {errorBackend}
          </div>
        )}

        {/* 1. Ingreso de Correo */}
        {paso === 'EMAIL' && (
          <CardIngresoEmail
            onVerificarEmail={handleVerificarEmail}
            cargando={cargando}
          />
        )}

        {/* 2A. Ingreso de Contraseña */}
        {paso === 'PASSWORD' && (
          <CardIngresoPassword
            email={email}
            onLogin={handleLogin}
            onVolver={() => setPaso('EMAIL')}
            cargando={cargando}
            errorBackend={errorBackend}
          />
        )}

        {/* 2B. Formulario de Registro */}
        {paso === 'REGISTRO' && (
          <CardRegistro
            email={email}
            onRegistro={handleRegistro}
            cargando={cargando}
            errorBackend={errorBackend}
          />
        )}

        {/* 3A. Estado: Ya posee suscripción activa */}
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

        {/* 3B. Estado: Formulario de Pago Simulado */}
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