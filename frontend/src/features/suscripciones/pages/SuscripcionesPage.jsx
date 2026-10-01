import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlanes } from '../services/suscripcionesService';
import { TarjetaPlan } from '../components/TarjetaPlan';

export function SuscripcionesPage() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    getPlanes()
      .then((datos) => {
        setPlanes(datos);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const manejarSuscripcion = (nombrePlan) => {
    navigate(`/suscripciones/${encodeURIComponent(nombrePlan)}`);
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

      {error && (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      )}

        {!cargando && !error && (
        <div className="tablas-planes-contenedor">
            {planes.map((planItem) => (
            <TarjetaPlan 
                key={planItem.id}
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