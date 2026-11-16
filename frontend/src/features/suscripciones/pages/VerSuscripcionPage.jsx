import React, { useState, useEffect } from 'react';
import { getSuscripcionActivaPorDni, getPlanes } from '../services/suscripcionesService';
import { getProductos } from '../../productos';
import { obtenerSesion } from '../../auth';

export function VerSuscripcionPage() {
    const [suscripcionesActivas, setSuscripcionesActivas] = useState([]);
    const [suscripcionesInactivas, setSuscripcionesInactivas] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const sesion = obtenerSesion();

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return '-';
        const fechaLimpia = String(fechaStr).split('T')[0];
        const partes = fechaLimpia.split('-');
        if (partes.length !== 3) return fechaStr;
        const [anio, mes, dia] = partes;
        return `${dia}/${mes}/${anio}`;
    };

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);

                if (!sesion?.token) {
                    setCargando(false);
                    return;
                }

                const [misSuscripciones, listaPlanes, todosLosProductos] = await Promise.all([
                    getSuscripcionActivaPorDni(),
                    getPlanes(),
                    getProductos()
                ]);

                const activas = misSuscripciones.filter((s) => s.activo === true);
                const inactivas = misSuscripciones.filter((s) => s.activo !== true);

                setSuscripcionesActivas(activas);
                setSuscripcionesInactivas(inactivas);
                setPlanes(listaPlanes || []);
                setProductos(todosLosProductos || []);
                setCargando(false);
            } catch (err) {
                console.error('Error al cargar la suscripción personal:', err);
                setError('Ocurrió un error al obtener los datos de tu suscripción.');
                setCargando(false);
            }
        }

        cargarDatos();
    }, [sesion?.token]);

    if (cargando) {
        return (
            <div className="container py-5 text-center st">
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

    const nombreTitular =
        suscripcionesActivas[0]?.nombre_cliente ||
        suscripcionesInactivas[0]?.nombre_cliente ||
        sesion.nombre ||
        'Cliente';

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                    Mi Panel de Suscripción
                </h2>
                <p className="text-muted fs-5">
                    Consultá los detalles de tus planes activos y tu historial de membresías.
                </p>
            </div>

            {/* SECCIÓN SUPERIOR: Suscripciones Activas */}
            {suscripcionesActivas.length === 0 ? (
                <div className="card shadow-sm border-0 rounded-4 p-5 bg-white mx-auto text-center mb-5" style={{ maxWidth: '650px' }}>
                    <h3 className="fw-bold mb-3" style={{ color: 'var(--titulos, #581845)' }}>
                        ¡Hola, {nombreTitular}! No tenés planes activos
                    </h3>
                    <p className="text-muted mb-4">
                        Actualmente no registramos ninguna suscripción de vinos vigente a tu nombre. ¡Sumate a nuestros planes y recibí etiquetas exclusivas todos los meses!
                    </p>
                    <div>
                        <a href="/suscripciones" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                            Conocer los planes
                        </a>
                    </div>
                </div>
            ) : (
                <div className="row justify-content-center g-4 mb-5">
                    {suscripcionesActivas.map((sub) => {
                        const planDetalle = planes.find(
                            (p) =>
                                Number(p.id) === Number(sub.plan_id) ||
                                (p.nombre && sub.plan_nombre && p.nombre.toLowerCase().trim() === sub.plan_nombre.toLowerCase().trim())
                        );

                        const productosDelMes = planDetalle?.productos_proximo_mes?.length > 0
                            ? productos.filter((p) => planDetalle.productos_proximo_mes.includes(p.id))
                            : [];

                        return (
                            <div key={sub.id} className="col-12 col-lg-8">
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                                    {/* Cabecera */}
                                    <div className="p-4 text-white d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                                        <h4 className="mb-0 fw-bold">
                                            PLAN {(sub.plan_nombre || planDetalle?.nombre || '').toUpperCase()}
                                        </h4>
                                        <span className="badge bg-success px-3 py-2 rounded-pill fs-6">
                                            Estado: Activa
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4 p-md-5">
                                        <div className="row mb-4 pb-3 border-bottom g-3">
                                            <div className="col-6 col-md-4">
                                                <span className="text-muted d-block small">Titular</span>
                                                <strong className="fs-6">{sub.nombre_cliente || nombreTitular}</strong>
                                            </div>
                                            <div className="col-6 col-md-4">
                                                <span className="text-muted d-block small">Fecha de Pago</span>
                                                <strong className="fs-6">{formatearFecha(sub.fecha_pago)}</strong>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <span className="text-muted d-block small">Valor Mensual</span>
                                                <strong className="fs-6">
                                                    ${Number(sub.monto || planDetalle?.valor || 0).toLocaleString('es-AR')}
                                                </strong>
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

                                                <div className="p-3 bg-light rounded-3">
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
                        );
                    })}
                </div>
            )}

            {/* SECCIÓN INFERIOR: Historial de Suscripciones Inactivas */}
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        <div className="card-header bg-white py-3 px-4 border-bottom">
                            <h5 className="mb-0 fw-bold" style={{ color: 'var(--titulos, #581845)' }}>
                                Historial de Suscripciones Anteriores
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">Plan</th>
                                            <th>Fecha de Pago</th>
                                            <th>Método</th>
                                            <th className="text-end">Monto</th>
                                            <th className="text-center pe-4">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {suscripcionesInactivas.length > 0 ? (
                                            suscripcionesInactivas.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td className="ps-4 fw-semibold text-dark">
                                                        {sub.plan_nombre || `Plan #${sub.plan_id}`}
                                                    </td>
                                                    <td>{formatearFecha(sub.fecha_pago)}</td>
                                                    <td>{sub.metodo_pago || '-'}</td>
                                                    <td className="text-end fw-semibold">
                                                        ${Number(sub.monto || 0).toLocaleString('es-AR')}
                                                    </td>
                                                    <td className="text-center pe-4">
                                                        <span className="badge bg-secondary bg-opacity-25 text-secondary">
                                                            Inactiva
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-muted small">
                                                    No hay suscripciones inactivas en tu historial.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerSuscripcionPage;