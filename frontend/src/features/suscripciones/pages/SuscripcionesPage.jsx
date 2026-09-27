import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerPlanesSuscripciones } from '../services/suscripcionesService';
import { TarjetaPlan } from '../componentes/TarjetaPlan';

export function SuscripcionesPage() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Pedimos los planes de suscripción
    obtenerPlanesSuscripciones()
      .then((datos) => {
        setPlanes(datos);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  // Función que se ejecuta al presionar "Suscribirme" en cualquier tarjeta
  const manejarSuscripcion = (nombrePlan) => {
    // Redirige a la página de detalle/configuración del plan elegido
    navigate(`/planesSuscripciones/${nombrePlan.toLowerCase()}`);
  };

  return (
    <section className="container py-5 text-center">
      <div className="encabezado-suscripciones">
        <h1 className="titulo-principal">Suscripciones Mensuales</h1>
        <div className="linea-decorativa"></div>
        <p className="descripcion-encabezado">
          Sumate a nuestro club y recibí mes a mes una selección exclusiva, directo en la puerta de tu casa.
        </p>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      )}

        {/* MOSTRAR TARJETAS EN CUADRÍCULA CUANDO TERMINA DE CARGAR */}
        {!cargando && !error && (
        <div className="tablas-planes-contenedor">
            {planes.map((planItem, index) => (
            <TarjetaPlan 
                key={index} 
                plan={planItem} 
                onSuscribir={manejarSuscripcion} 
            />
            ))}
  </div>
)}
    </section>
  );
}

export default SuscripcionesPage;