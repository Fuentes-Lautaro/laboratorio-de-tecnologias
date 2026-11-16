import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSuscripcionActivaPorDni, getPlanes, getProductosPorPlanYPeriodo } from '../services/suscripcionesService';
import { getProductos } from '../../productos';
import { obtenerSesion } from '../../auth';

export function VerSuscripcionPage() {
    const [suscripcionesActivas, setSuscripcionesActivas] = useState([]);
    const [suscripcionesInactivas, setSuscripcionesInactivas] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [productosPorSub, setProductosPorSub] = useState({});
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

    // Función auxiliar para calcular el mes siguiente en formato estricto YYYY-MM
    const obtenerPeriodoMesSiguiente = (fechaStr) => {
        if (!fechaStr) return null;
        const fechaLimpia = String(fechaStr).split('T')[0];
        const partes = fechaLimpia.split('-');
        
        if (partes.length === 3) {
            let [anio, mes] = partes.map(Number);
            mes += 1; // Sumamos un mes
            if (mes > 12) {
                mes = 1;
                anio += 1;
            }
            const mesStr = String(mes).padStart(2, '0');
            return `${anio}-${mesStr}`; // Formato exacto YYYY-MM
        }
        return null;
    };

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);
                setError(null);

                if (!sesion?.token) {
                    setCargando(false);
                    return;
                }

                const [misSuscripciones, listaPlanes, todosLosProductos] = await Promise.all([
                    getSuscripcionActivaPorDni(sesion?.dni),
                    getPlanes().catch(() => []),
                    getProductos().catch(() => [])
                ]);

                const subsArray = Array.isArray(misSuscripciones) ? misSuscripciones : (misSuscripciones ? [misSuscripciones] : []);

                const activas = subsArray.filter((s) => s.activo === true);
                const inactivas = subsArray.filter((s) => s.activo !== true);

                setSuscripcionesActivas(activas);
                setSuscripcionesInactivas(inactivas);
                setPlanes(listaPlanes || []);

                // Cargar los productos específicos para cada suscripción activa usando el período YYYY-MM
                const mapaProductos = {};
                for (const sub of activas) {
                    if (sub.plan_id) {
                        try {
                            const periodoSiguiente = obtenerPeriodoMesSiguiente(sub.fecha_pago);
                            const idsProductos = await getProductosPorPlanYPeriodo(sub.plan_id, periodoSiguiente);
                            
                            const filtrados = todosLosProductos.length > 0 && idsProductos?.length > 0
                                ? todosLosProductos.filter((p) => 
                                    idsProductos.some(idProd => Number(idProd) === Number(p.id))
                                )
                                : [];
                            
                            mapaProductos[sub.id || sub.plan_id] = filtrados;
                        } catch (err) {
                            console.warn(`No se pudo obtener el registro mensual para el plan ${sub.plan_id}.`);
                            mapaProductos[sub.id || sub.plan_id] = [];
                        }
                    }
                }
                setProductosPorSub(mapaProductos);

            } catch (err) {
                console.error('Error al cargar la suscripción personal:', err);
                setError('Ocurrió un error al obtener los datos de tu suscripción.');
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, [sesion?.token, sesion?.dni]);

    if (cargando) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" style={{ color: '#3E100F' }}>
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
                    <Link to="/login" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                        Iniciar sesión
                    </Link>
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
                    Consultá los detalles de tus planes activos y tu historial de membresías.
                </p>
            </div>

            {/* SECCIÓN SUPERIOR: Suscripciones Activas */}
            {suscripcionesActivas.length === 0 ? (
                <div className="card shadow-sm border-0 rounded-4 p-5 bg-white mx-auto text-center mb-5" style={{ maxWidth: '650px' }}>
                    <h3 className="fw-bold mb-3" style={{ color: 'var(--titulos, #581845)' }}>
                        ¡Hola! No tenés planes activos este mes
                    </h3>
                    <p className="text-muted mb-4">
                        Actualmente no registramos ninguna suscripción de vinos vigente para el período actual. ¡Sumate o renová tu plan para recibir etiquetas exclusivas entre el 1 y el 10 del próximo mes!
                    </p>
                    <div>
                        <Link to="/suscripciones" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                            Conocer los planes
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row justify-content-center g-4 mb-5">
                    {suscripcionesActivas.map((sub, idx) => {
                        const planDetalle = planes.find(
                            (p) =>
                                Number(p.id) === Number(sub.plan_id) ||
                                (p.nombre && sub.plan_nombre && p.nombre.toLowerCase().trim() === sub.plan_nombre.toLowerCase().trim())
                        );

                        const productosDelMes = productosPorSub[sub.id || sub.plan_id] || [];

                        return (
                            <div key={sub.id || idx} className="col-12 col-lg-8">
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                                    
                                    {/* Cabecera */}
                                    <div className="p-4 text-white d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                                        <h4 className="mb-0 fw-bold">
                                            PLAN {(sub.plan_nombre || planDetalle?.nombre || 'Especial').toUpperCase()}
                                        </h4>
                                        <span className="badge bg-success px-3 py-2 rounded-pill fs-6">
                                            Estado: Activa
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4 p-md-5">
                                        <div className="row mb-4">
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <span className="text-muted small d-block">Titular de la suscripción</span>
                                                <strong className="fs-6 text-dark">{sub.nombre_cliente || sesion.nombre}</strong>
                                            </div>
                                            <div className="col-md-6">
                                                <span className="text-muted small d-block">Fecha de contratación / pago</span>
                                                <strong className="fs-6 text-dark">{formatearFecha(sub.fecha_pago)}</strong>
                                            </div>
                                        </div>

                                        <div className="row mb-4">
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <span className="text-muted small d-block">Método de pago</span>
                                                <strong className="fs-6 text-dark">{sub.metodo_pago || 'No especificado'}</strong>
                                            </div>
                                            <div className="col-md-6">
                                                <span className="text-muted small d-block">Monto abonado</span>
                                                <strong className="fs-6 text-success">${Number(sub.monto || planDetalle?.precio || 0).toLocaleString('es-AR')}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* SECCIÓN INFERIOR: Historial de Suscripciones Anteriores */}
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
                                            <th className="text-center">Estado</th>
                                            <th className="text-end pe-4">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {suscripcionesInactivas.length > 0 ? (
                                            suscripcionesInactivas.map((sub, idx) => {
                                                const planAsociado = planes.find(
                                                    (p) =>
                                                        Number(p.id) === Number(sub.plan_id) ||
                                                        (p.nombre && sub.plan_nombre && p.nombre.toLowerCase().trim() === sub.plan_nombre.toLowerCase().trim())
                                                );

                                                const nombrePlanRuta = sub.plan_nombre || planAsociado?.nombre || '';

                                                const yaTienePlanActivo = suscripcionesActivas.some(
                                                    (act) =>
                                                        Number(act.plan_id) === Number(sub.plan_id) ||
                                                        (act.plan_nombre && sub.plan_nombre && act.plan_nombre.toLowerCase().trim() === sub.plan_nombre.toLowerCase().trim())
                                                );
                                                const planDisponible = planAsociado ? planAsociado.activo !== false : Boolean(nombrePlanRuta);
                                                const puedeRenovar = !yaTienePlanActivo && planDisponible && Boolean(nombrePlanRuta);

                                                return (
                                                    <tr key={sub.id || idx}>
                                                        <td className="ps-4 fw-semibold text-dark">
                                                            {nombrePlanRuta || `Plan #${sub.plan_id}`}
                                                        </td>
                                                        <td>{formatearFecha(sub.fecha_pago)}</td>
                                                        <td>{sub.metodo_pago || '-'}</td>
                                                        <td className="text-end fw-semibold">
                                                            ${Number(sub.monto || 0).toLocaleString('es-AR')}
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge bg-secondary bg-opacity-25 text-secondary">
                                                                Inactiva
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            {puedeRenovar ? (
                                                                <Link
                                                                    to={`/suscripciones/${encodeURIComponent(nombrePlanRuta)}`}
                                                                    className="btn btn-sm text-white rounded-pill px-3 fw-semibold"
                                                                    style={{ backgroundColor: 'var(--titulos, #581845)' }}
                                                                >
                                                                    Renovar
                                                                </Link>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted small">
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