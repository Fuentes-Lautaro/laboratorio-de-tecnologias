import React from 'react';

function PromocionPlanes() {
    return (
        <section className="planes-seccion py-5" style={{ 
            backgroundColor: 'var(--fondos-principales, #F9EBE0)', 
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: '-1.5rem', // Cancela el espacio blanco superior del main,
            marginBottom: '-1.5rem' // Cancela el espacio blanco inferior del main
             }}>
                
            <div className="container py-4">

                {/* Encabezado de la Sección */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos)' }}>
                        Elegí tu suscripción
                    </h2>
                    <p className="text-dark fs-5" >
                        Recibí vinos seleccionados cada mes y disfrutá de beneficios exclusivos.
                    </p>
                </div>

                {/* Grilla de Tarjetas / Planes */}
                <div className="row g-4 align-items-stretch justify-content-center">

                    {/* 1. PLAN ESENCIAL */}
                    <div className="col-12 col-md-4">
                        <article className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column justify-content-between">
                            <div className="card-body p-0">
                                <h3 className="card-title fw-bold h4 mb-2">Plan Esencial</h3>
                                <p className="card-text mb-4">Breve descripción del plan esencial.</p>

                                <h4 className="fw-bold mb-4 fs-3">
                                    $$$ <span className="fs-6 fw-normal text-muted">/ mes</span>
                                </h4>

                                <ul className="list-unstyled text-muted small mb-4 d-flex flex-column gap-2">
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                </ul>
                            </div>

                            {/* Botón alineado abajo */}
                            <div className="pt-3">
                                <button className="btn btn-light rounded-3 px-4 py-2 fw-semibold shadow-sm text-dark">
                                    Suscribirme
                                </button>
                            </div>
                        </article>
                    </div>

                    {/* 2. PLAN SELECCIÓN (DESTACADO) */}
                    <div className="col-12 col-md-4">
                        <article
                            className="card h-100 shadow rounded-4 p-4 text-center d-flex flex-column justify-content-between"
                            style={{ border: '2px solid #C59B27' }} /* Borde dorado destacado */
                        >
                            <div className="card-body p-0">
                                {/* Badge/Etiqueta Superior */}
                                <div className="text-uppercase fw-bold small mb-2" style={{ color: '#B58107', fontSize: '0.85rem' }}>
                                    ⭐ MÁS ELEGIDO
                                </div>

                                <h3 className="card-title fw-bold h4 mb-2">Plan Selección</h3>
                                <p className="card-text mb-4">breve descripción del plan de selección.</p>

                                <h4 className="fw-bold mb-4 fs-3">
                                    $$$ <span className="fs-6 fw-normal text-muted">/ mes</span>
                                </h4>

                                <ul className="list-unstyled text-muted small mb-4 d-flex flex-column gap-2">
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                </ul>
                            </div>

                            {/* Botón alineado abajo */}
                            <div className="pt-3">
                                <button className="btn btn-light rounded-3 px-4 py-2 fw-semibold shadow-sm text-dark">
                                    Suscribirme
                                </button>
                            </div>
                        </article>
                    </div>

                    {/* 3. PLAN PREMIUM */}
                    <div className="col-12 col-md-4">
                        <article className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column justify-content-between">
                            <div className="card-body p-0">
                                <h3 className="card-title fw-bold h4 mb-2">Plan Premium</h3>
                                <p className="card-text  mb-4">Breve descripción del plan premium.</p>

                                <h4 className="fw-bold mb-4 fs-3">
                                    $$$$ <span className="fs-6 fw-normal text-muted">/ mes</span>
                                </h4>

                                <ul className="list-unstyled text-muted small mb-4 d-flex flex-column gap-2">
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                    <li>......</li>
                                </ul>
                            </div>

                            {/* Botón alineado abajo */}
                            <div className="pt-3">
                                <button className="btn btn-light rounded-3 px-4 py-2 fw-semibold shadow-sm text-dark">
                                    Suscribirme
                                </button>
                            </div>
                        </article>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default PromocionPlanes;