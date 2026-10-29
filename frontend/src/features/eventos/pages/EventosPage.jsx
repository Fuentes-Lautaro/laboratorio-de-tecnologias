import { useState, useEffect } from 'react';
import EventoCard from '../components/EventoCard';
import { getEventos } from '../services/eventoService'; 

export function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await getEventos();
        setEventos(data || []);
      } catch (error) {
        console.error('Error al cargar eventos desde el servicio:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Encabezado */}
        <div className="text-center mb-5 max-w-2xl mx-auto">
          <span 
            className="badge rounded-pill px-3 py-2 mb-2 text-uppercase fw-semibold"
            style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', letterSpacing: '1px' }}
          >
            Experiencias & Catas
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#3E100F' }}>
            Próximos Eventos
          </h1>
          <p className="text-secondary lead fs-6">
            Descubrí nuestras degustaciones exclusivas, noches de maridaje y talleres guiados por sommeliers profesionales.
          </p>
        </div>

        {/* Estado de Carga */}
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando eventos...</span>
            </div>
            <p className="text-muted mt-3 small">Cargando cartelera de eventos...</p>
          </div>
        ) : (
          <>
            {/* Grilla */}
            {eventos.length > 0 ? (
              <div className="row g-4">
                {eventos.map((evento) => (
                  <div key={evento.e_id} className="col-12 col-md-6 col-lg-4">
                    <EventoCard evento={evento} esGestion={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
                <span style={{ fontSize: '2.5rem' }}>🍷</span>
                <h5 className="fw-bold mt-3 mb-1" style={{ color: '#3E100F' }}>
                  No hay eventos programados
                </h5>
                <p className="text-muted small mb-0">
                  Por el momento no hay eventos disponibles. ¡Vuelve a consultar pronto!
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default EventosPage;