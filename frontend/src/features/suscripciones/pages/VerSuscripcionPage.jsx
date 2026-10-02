import React, { useState, useEffect } from 'react';
import { getSuscripcionActivaPorDni, getPlanes } from '../services/suscripcionesService';
import { getProductos } from '../../productos';
import { obtenerSesion } from '../../auth'; // Ajusta la ruta a tu archivo de auth

export function VerSuscripcionPage() {
    const [suscripcion, setSuscripcion] = useState(null);
    const [planDetalle, setPlanDetalle] = useState(null);
    const [productosDelMes, setProductosDelMes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Obtenemos la sesión activa directamente con tu función
    const sesion = obtenerSesion();
    const clienteDni = sesion ? sesion.dni : null;
    const clienteNombre = sesion ? sesion.nombre : null;

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);

                if (!clienteDni) {
                    setCargando(false);
                    return;
                }

                // 1. Buscamos si este cliente tiene una suscripción activa usando su DNI
                const subActiva = await getSuscripcionActivaPorDni(clienteDni);
                setSuscripcion(subActiva);

                if (subActiva) {
                    // 2. Buscamos los detalles del plan para mostrar la descripción y los vinos
                    const planes = await getPlanes();
                    const planEncontrado = planes.find(
                        (p) => p.nombre.toLowerCase().trim() === subActiva.planNombre.toLowerCase().trim()
                    );

                    if (planEncontrado) {
                        setPlanDetalle(planEncontrado);

                        if (planEncontrado.productos_proximo_mes && planEncontrado.productos_proximo_mes.length > 0) {
                            const todosLosProductos = await getProductos();
                            const filtrados = todosLosProductos.filter((p) => 
                                planEncontrado.productos_proximo_mes.includes(p.id)
                            );
                            setProductosDelMes(filtrados);
                        }
                    }
                }

                setCargando(false);
            } catch (err) {
                console.error("Error al cargar la suscripción personal:", err);
                setError("Ocurrió un error al obtener los datos de tu suscripción.");
                setCargando(false);
            }
        }

        cargarDatos();
    }, [clienteDni]);

    if (cargando) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center rounded-4 p-4">{error}</div>
            </div>
        );
    }

    // Si no hay sesión iniciada
    if (!sesion) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow-sm border-0 rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: '600px' }}>
                    <h3 className="fw-bold mb-3" style={{ color: 'var(--titulos, #581845)' }}>
                        Iniciá sesión para ver tu suscripción
                    </h3>
                    <p className="text-muted mb-4">
                        Necesitamos verificar tus datos personales para mostrarte el estado de tus beneficios y envíos de vinos.
                    </p>
                    <a href="/login" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                        Iniciar sesión
                    </a>
                </div>
            </div>
        );
    }

    // Si tiene sesión pero no una suscripción activa
    if (!suscripcion) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow-sm border-0 rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: '650px' }}>
                    <h3 className="fw-bold mb-3" style={{ color: 'var(--titulos, #581845)' }}>
                        ¡Hola, {sesion.nombre || 'Cliente'}! No tenés planes activos
                    </h3>
                    <p className="text-muted mb-4">
                        Actualmente no registramos ninguna suscripción de vinos vigente a tu nombre ({clienteNombre}). ¡Sumate a nuestros planes y recibí etiquetas exclusivas todos los meses!
                    </p>
                    <a href="/suscripciones" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                        Conocer los planes
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                    Mi Panel de Suscripción
                </h2>
                <p className="text-muted fs-5">
                    Consultá los detalles de tu plan actual y la selección de vinos en camino.
                </p>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        
                        {/* Cabecera */}
                        <div className="p-4 text-white d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                            <h4 className="mb-0 fw-bold">
                                PLAN {suscripcion.planNombre?.toUpperCase()}
                            </h4>
                            <span className="badge bg-success px-3 py-2 rounded-pill fs-6">
                                Estado: {suscripcion.activa ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>

                        {/* Contenido */}
                        <div className="p-4 p-md-5">
                            <div className="row mb-4 pb-3 border-bottom">
                                <div className="col-6">
                                    <span className="text-muted d-block small">Titular</span>
                                    <strong className="fs-6">{sesion.nombre || clienteDni}</strong>
                                </div>
                                <div className="col-6">
                                    <span className="text-muted d-block small">Próximo Envío</span>
                                    <strong className="fs-6">{suscripcion.proximoEnvio || 'En curso'}</strong>
                                </div>
                            </div>

                            {planDetalle && (
                                <>
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                                            Beneficios del Plan
                                        </h5>
                                        <p className="text-muted mb-2">{planDetalle.descripcion}</p>
                                        <div className="fw-semibold text-dark">
                                            🍷 Selección mensual: {planDetalle.cantidad_vinos} botellas
                                        </div>
                                    </div>

                                    <div className="p-3 bg-light rounded-3 mb-4">
                                        <strong className="d-block mb-2 text-dark">Vinos asignados para tu próxima caja:</strong>
                                        <ul className="mb-0 ps-3 text-muted small">
                                            {productosDelMes.length > 0 ? (
                                                productosDelMes.map((prod) => (
                                                    <li key={prod.id} className="mb-1">
                                                        {prod.marca} - {prod.varietal} ({prod.medida})
                                                    </li>
                                                ))
                                            ) : (
                                                <li>La selección se actualizará en los próximos días.</li>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerSuscripcionPage;