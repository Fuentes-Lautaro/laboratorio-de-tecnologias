import React from 'react';
import FormularioContacto from '../components/FormularioContacto';
import Tarjeta from '../../../shared/components/Tarjeta';

const DATOS_CONTACTO = [
  { id: 1, titulo: 'Dirección', texto: 'San Luis, Argentina' },
  { id: 2, titulo: 'Horario', texto: 'Lunes a sábado de 9 a 20 hs' },
  { id: 3, titulo: 'Email', texto: 'mariabalbina@gmail.com' },
];

function ContactoPage() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Encabezado / Hero con el estilo consistente */}
        <div className="text-center mb-5 max-w-2xl mx-auto">
          <span 
            className="badge rounded-pill px-3 py-2 mb-2 text-uppercase fw-semibold"
            style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', letterSpacing: '1px' }}
          >
            Atención Personalizada
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#3E100F' }}>
            Contacto
          </h1>
          <p className="text-secondary lead fs-6">
            ¿Tenés alguna duda? Escribinos y te respondemos en la brevedad.
          </p>
        </div>

        {/* Grilla principal de contenido */}
        <div className="row g-4 g-lg-5 align-items-stretch">
          
          {/* Columna de Información de Contacto */}
          <div className="col-lg-5">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column justify-content-between border-0">
              <div>
                <h3 className="h4 fw-bold mb-4" style={{ color: '#3E100F' }}>
                  Información
                </h3>
                <ul className="list-unstyled">
                  {DATOS_CONTACTO.map((dato) => (
                    <li key={dato.id} className="mb-4">
                      <strong className="d-block fw-semibold" style={{ color: '#3E100F' }}>
                        {dato.titulo}
                      </strong>
                      <span className="text-secondary">{dato.texto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-top text-muted small">
                <span>🍷 Estamos para asesorarte en cada experiencia.</span>
              </div>
            </div>
          </div>

          {/* Columna del Formulario con la Tarjeta contenedora */}
          <div className="col-lg-7">
            <Tarjeta titulo="Envianos tu consulta" className="border-0 shadow-sm rounded-3">
              <FormularioContacto />
            </Tarjeta>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ContactoPage;