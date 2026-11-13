import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlanes } from '../services/suscripcionesService';
import { TarjetaPlan } from '../components/TarjetaPlan';

export function SuscripcionesPage({ className = "" }) {
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

  // Filtramos para mostrar únicamente los planes que estén activos
  const planesActivos = planes.filter(plan => plan.activo !== false);

  return (
    <section className={`container-fluid py-5 text-center ${className}`}>
      <div className="container">
        <div className="text-center mb-3 max-w-2xl mx-auto">
          <span 
            className="badge rounded-pill px-3 py-2 mb-2 text-uppercase fw-semibold"
            style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', letterSpacing: '1px' }}
          >
            Nuestra comunidad
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#3E100F' }}>
            Planes Mensuales
          </h1>
          <p className="text-secondary lead fs-6">
            Descubrí nuestros planes y obtené beneficios exclusivos.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger my-4" role="alert">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="tablas-planes-contenedor">
            {planesActivos.map((planItem) => (
              <TarjetaPlan 
                key={planItem.id}
                plan={planItem} 
                onSuscribir={manejarSuscripcion} 
              />
            ))}
          </div>
        )}

        <div className="my-5"></div>

        {/* Sección: ¿Cómo funciona? */}
        <div 
          className="p-4 p-md-5 mb-5 rounded-4 text-start shadow-sm"
          style={{ backgroundColor: 'rgba(181, 134, 90, 0.08)', border: '1px solid rgba(181, 134, 90, 0.2)' }}
        >
          <div className="row align-items-center mb-4">
            <div className="col-lg-10 mx-auto text-center">
              <h2 className="h4 fw-bold mb-2" style={{ color: '#3E100F' }}>
                ¿Cómo funcionan nuestros planes mensuales?
              </h2>
              <p className="text-secondary mb-0">
                Nuestras suscripciones están diseñadas para que recibas una selección de productos todos los meses en la puerta de tu casa, además de acceder a descuentos especiales y experiencias únicas para miembros.
              </p>
            </div>
          </div>

          <div className="row g-4 text-center mt-2">
            <div className="col-md-4">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                style={{ width: '42px', height: '42px', backgroundColor: '#3E100F', color: '#fff' }}
              >
                1
              </div>
              <h3 className="h6 fw-bold" style={{ color: '#3E100F' }}>Elegí tu plan</h3>
              <p className="small text-secondary mb-0">
                Seleccioná el plan que mejor se adapte a tus gustos y preferencias.
              </p>
            </div>

            <div className="col-md-4">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                style={{ width: '42px', height: '42px', backgroundColor: '#3E100F', color: '#fff' }}
              >
                2
              </div>
              <h3 className="h6 fw-bold" style={{ color: '#3E100F' }}>Recibilo todos los meses</h3>
              <p className="small text-secondary mb-0">
                Preparamos y enviamos tu selección mensual directamente a tu domicilio sin complicaciones.
              </p>
            </div>

            <div className="col-md-4">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                style={{ width: '42px', height: '42px', backgroundColor: '#3E100F', color: '#fff' }}
              >
                3
              </div>
              <h3 className="h6 fw-bold" style={{ color: '#3E100F' }}>Disfrutá los beneficios</h3>
              <p className="small text-secondary mb-0">
                Gestioná tu plan modificándolo o cambiándolo cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuscripcionesPage;