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
      <div className="text-center mb-3 max-w-2xl mx-auto">
        <span 
          className="badge rounded-pill px-3 py-2 mb-2 text-uppercase fw-semibold"
          style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', letterSpacing: '1px' }}
        >
          Nuestra comunidad
        </span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#3E100F' }}>
            Suscripciones
          </h1>
          <p className="text-secondary lead fs-6">
            Descubrí nuestros planes y obtene beneficios exclusivos.
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