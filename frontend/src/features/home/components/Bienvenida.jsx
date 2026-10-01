import React from 'react';
import '../../../styles/variables.css'

const Bienvenida = () => {
  return (
    // py-5 da padding vertical (arriba y abajo) usando Bootstrap
    <section className="informacion-bienvenida py-5"
    style={{
        backgroundColor: 'var(--paneles)', // Usando la variable CSS para el color primario
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-1.5rem' // Cancela el espacio blanco superior del main

    }}>
      <div className="container">
        
        {/* Título de la sección */}
        <div className="row justify-content-center mb-5 text-center">
          <div className="col-12 col-md-8 info-titulo">
            <span className="text-uppercase tracking-wide" style={{ color: '#ffffff' }} > MARÍA BALBINA</span>


            <h2 className="my-3" style={{ color: 'var(--detalles)' }}>MUCHO MÁS QUE UNA VINERIA</h2>
            <p className="lead" style={{ color: '#ffffff' }}>
              Ser parte de María Balbina es disfrutar del vino,
              descubrir nuevos sabores y vivir experiencias únicas.
            </p>
          </div>
        </div>

        {/* Grid de tarjetas (Cards) */}
        <div className="row g-4 justify-content-center">
          
          {/* Tarjeta 1 */}
          <div className="col-12 col-md-6" >
            <article className="card h-100 info-card border-0 shadow-sm p-4 >">
              <div className="card-body ">
                <div className="info-icono fs-2 mb-3">✦</div>
                <h3 className="card-title h5 mb-3" style={{ color: 'var(--detalles)', fontWeight: 'bold' }}>Beneficios exclusivos</h3>
                <p className="card-text text-muted mb-4">
                  Como cliente disfrutás de beneficios pensados
                  especialmente para vos.
                </p>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">— Recibí vinos mensualmente</li>
                  <li className="mb-2">— Acceso a preventas</li>
                  <li className="mb-2">— Descuentos en próximas compras</li>
                </ul>
              </div>
            </article>
          </div>

          {/* Tarjeta 2 */}
          <div className="col-12 col-md-6">
            <article className="card h-100 info-card border-0 shadow-sm p-4">
              <div className="card-body">
                <div className="info-icono fs-2 mb-3">❖</div>
                <h3 className="card-title h5 mb-3" style={{ color: 'var(--detalles)', fontWeight: 'bold' }}>Eventos presenciales</h3>
                <p className="card-text text-muted mb-4">
                  Compartí nuestra pasión por el vino en encuentros
                  pensados para disfrutar, aprender y descubrir.
                </p>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">— Catas para descubrir</li>
                  <li className="mb-2">— Cenas para recordar</li>
                  <li className="mb-2">— Viajes para nunca olvidar</li>
                </ul>
              </div>
            </article>
          </div>

          {/* Tarjeta 3 */}
          <div className="col-12 col-md-6">
            <article className="card h-100 info-card border-0 shadow-sm p-4">
              <div className="card-body">
                <div className="info-icono fs-2 mb-3">♡</div>
                <h3 className="card-title h5 mb-3" style={{ color: 'var(--detalles)', fontWeight: 'bold' }}>Sobre nosotros</h3>
                <p className="card-text text-muted mb-4">
                  cómo empezó todo...
                </p>
                {/* Nota: Si usas React Router, cambia la etiqueta <a> por <Link to="/nosotros"> */}
                <a href="/nosotros" className="info-link text-decoration-none fw-bold" style={{ color: 'var(--titulos)', fontWeight: 'bold' }}>
                  CONOCÉ NUESTRA HISTORIA →
                </a>
              </div>
            </article>
          </div>

          {/* Tarjeta 4 */}
          <div className="col-12 col-md-6">
            <article className="card h-100 info-card border-0 shadow-sm p-4">
              <div className="card-body">
                <div className="info-icono fs-2 mb-3">+</div>
                <h3 className="card-title h5 mb-3" style={{ color: 'var(--detalles)', fontWeight: 'bold' }}>¡Podés visitarnos en nuestro local!</h3>
                <p className="card-text text-muted mb-4">
                  Estamos en Maipú 650 de:
                </p>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">— 9:00hs a 14:00hs</li>
                  <li className="mb-2">— 17:30hs a 23:00hs</li>
                </ul>
              </div>
            </article>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Bienvenida;