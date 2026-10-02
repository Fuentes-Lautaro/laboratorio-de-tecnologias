import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlanes } from '../../suscripciones';
import { getProductos } from '../../productos';

export function PromocionPlanes() {
    const navigate = useNavigate();
    const [planes, setPlanes] = useState([]);
    const [productosMap, setProductosMap] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarDatos() {
            try {
                // Obtenemos los planes y los productos en paralelo para mapear los vinos
                const [datosPlanes, todosLosProductos] = await Promise.all([
                    getPlanes(),
                    getProductos()
                ]);
                
                // Creamos un diccionario para buscar productos rápidamente por su ID
                const prodMap = {};
                todosLosProductos.forEach(p => {
                    prodMap[p.id] = p;
                });

                setPlanes(datosPlanes);
                setProductosMap(prodMap);
                setCargando(false);
            } catch (error) {
                console.error("Error al cargar los datos de la promoción:", error);
                setCargando(false);
            }
        }
        cargarDatos();
    }, []);

    return (
        <section className="planes-seccion bg-light py-5" style={{ 
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: '-1.5rem',
            marginBottom: '-1.5rem'
        }}>
            <div className="container py-4">

                {/* Encabezado de la Sección */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos)' }}>
                        Elegí tu suscripción
                    </h2>
                    <p className="text-dark fs-5">
                        Recibí vinos seleccionados cada mes y disfrutá de beneficios exclusivos.
                    </p>
                </div>

                {/* Grilla de Tarjetas Propias */}
                <div className="row g-4 align-items-stretch justify-content-center mb-5">
                    {cargando ? (
                        <p className="text-center">Cargando planes...</p>
                    ) : (
                        planes.map((plan) => {
                            const { id, nombre, descripcion, cantidad_vinos, productos_proximo_mes } = plan;
                            
                            return (
                                <div className="col-12 col-md-4 d-flex align-items-stretch" key={id || nombre}>
                                    <div className="w-100 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column border-0">
                                        
                                        {/* Cabecera de la tarjeta con el color de títulos */}
                                        <div className="p-3 text-center fw-bold" style={{ backgroundColor: 'var(--titulos, #581845)', color: 'var(--detalles, #ffffff)' }}>
                                            PLAN {nombre?.toUpperCase()}
                                        </div>

                                        {/* Cuerpo con la información */}
                                        <div className="p-4 d-flex flex-column flex-grow-1 text-center">
                                            
                                            {/* Descripción */}
                                            <p className="text-muted small mb-3">
                                                {descripcion}
                                            </p>

                                            {/* Cantidad de vinos */}
                                            <div className="mb-3 fw-semibold">
                                                📦 {cantidad_vinos} {cantidad_vinos === 1 ? 'vino mensual' : 'vinos mensuales'}
                                            </div>

                                            {/* Vinos del próximo mes */}
                                            <div className="text-start p-3 bg-light rounded-3 mt-auto">
                                                <strong className="d-block mb-1 small">Vinos del próximo mes:</strong>
                                                <ul className="mb-0 ps-3 small text-muted">
                                                    {productos_proximo_mes && productos_proximo_mes.length > 0 ? (
                                                        productos_proximo_mes.map((prodId) => {
                                                            const producto = productosMap[prodId];
                                                            return producto ? (
                                                                <li key={prodId}>
                                                                    {producto.marca} - {producto.varietal} - {producto.medida}
                                                                </li>
                                                            ) : null;
                                                        })
                                                    ) : (
                                                        <li>Próximamente más novedades</li>
                                                    )}
                                                </ul>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Botón inferior */}
                <div className="text-center mt-4">
                    <button 
                        className="btn px-5 py-3 rounded-pill fw-semibold shadow-sm"
                        style={{ 
                            backgroundColor: 'var(--titulos, #581845)',
                            color: '#ffffff',
                            letterSpacing: '0.5px',
                            border: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                        onClick={() => navigate('/suscripciones')}
                    >
                        Ver todos los planes ✨
                    </button>
                </div>

            </div>
        </section>
    );
}

export default PromocionPlanes;