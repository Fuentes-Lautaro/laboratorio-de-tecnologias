import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { obtenerResumen } from '../services/estadisticasService';
import { getPersonaPorId } from '../../personas/services/personasServices';
import { formatearPrecio } from '../../../shared/utils/formato';

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '-';
  const fechaLimpia = String(fechaStr).split('T')[0];
  const partes = fechaLimpia.split('-');
  if (partes.length !== 3) return fechaStr;
  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
};

const obtenerFechaHoyISO = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const desplazarFechaISO = (fechaISO, dias) => {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  fecha.setDate(fecha.getDate() + dias);
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
};

export function EstadisticasPage() {
  const { usuario } = useOutletContext() || { usuario: { nombre: 'Usuario' } };
  const [resumen, setResumen] = useState(null);
  const [persona, setPersona] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaHoyISO);
  const [cargando, setCargando] = useState(true);
  const [cargandoDiario, setCargandoDiario] = useState(false);
  const [error, setError] = useState(null);

  const hoyISO = obtenerFechaHoyISO();
  const esHoy = fechaSeleccionada >= hoyISO;

  // Cargar datos del perfil una sola vez
  useEffect(() => {
    let isMounted = true;
    getPersonaPorId()
      .then((datosPersona) => {
        if (isMounted) setPersona(datosPersona);
      })
      .catch((err) => {
        console.error('Error al obtener datos del perfil:', err);
        if (isMounted) setPersona(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Cargar resumen general + estadísticas diarias de la fecha seleccionada
  useEffect(() => {
    let isMounted = true;

    async function cargarEstadisticas() {
      setCargandoDiario(true);
      try {
        const data = await obtenerResumen(fechaSeleccionada);
        if (isMounted) {
          setResumen(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) {
          setCargando(false);
          setCargandoDiario(false);
        }
      }
    }

    cargarEstadisticas();

    return () => {
      isMounted = false;
    };
  }, [fechaSeleccionada]);

  const handleDiaAnterior = () => {
    setFechaSeleccionada((prev) => desplazarFechaISO(prev, -1));
  };

  const handleDiaSiguiente = () => {
    if (esHoy) return;
    setFechaSeleccionada((prev) => desplazarFechaISO(prev, 1));
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status" style={{ color: '#3E100F' }}></div>
        <p className="text-muted small mt-2">Cargando estadísticas del negocio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm rounded-3 p-4 my-4" role="alert">
        <h5 className="fw-bold mb-1">No pudimos cargar el resumen</h5>
        <p className="mb-0 small">{error}</p>
      </div>
    );
  }

  const nombreUsuario = persona?.nombre || usuario?.nombre || 'Usuario';
  const diarias = resumen?.estadisticasDiarias || {
    fecha: fechaSeleccionada,
    totalDiario: 0,
    cantidadVentas: 0,
    porMetodoPago: []
  };

  return (
    <div className="container-fluid py-3">
      {/* Encabezado */}
      <header className="mb-4">
        <h1 className="h3 mb-1 fw-bold" style={{ color: '#3E100F' }}>Hola, {nombreUsuario}</h1>
        <p className="text-body-secondary mb-0">Estadísticas y reportes generales del negocio</p>
      </header>

      {/* Tarjetas Principales KPI (Incluye el plan más vendido) */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <div className="card h-100 shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#3E100F !important' }}>
            <div className="card-body">
              <p className="text-uppercase small text-body-secondary mb-1 fw-semibold">Total de ingresos mensuales</p>
              <p className="h3 fw-bold mb-1" style={{ color: '#3E100F' }}>{formatearPrecio(resumen?.totalIngresosMensuales || 0)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#3E100F !important' }}>
            <div className="card-body">
              <p className="text-uppercase small text-body-secondary mb-1 fw-semibold">Suscripciones activas</p>
              <p className="h3 fw-bold mb-1" style={{ color: '#3E100F' }}>{resumen?.suscripcionesActivas || 0}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#3E100F !important' }}>
            <div className="card-body">
              <p className="text-uppercase small text-body-secondary mb-1 fw-semibold">Clientes registrados</p>
              <p className="h3 fw-bold mb-1" style={{ color: '#3E100F' }}>{resumen?.clientesRegistrados || 0}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#3E100F !important' }}>
            <div className="card-body">
              <p className="text-uppercase small text-body-secondary mb-1 fw-semibold">Plan más vendido</p>
              <p className="h3 fw-bold mb-1 text-truncate" style={{ color: '#3E100F' }} title={resumen?.planMasVendido}>
                {resumen?.planMasVendido || 'Ninguno'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nueva Sección: Estadísticas Diarias de Ventas (sin suscripciones) */}
      <div className="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
          <div>
            <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>
              Estadísticas de Ventas
            </h5>
            <small className="text-muted">Ventas del día</small>
          </div>

          {/* Selector de Fecha con Flechas */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary fw-bold px-2"
              onClick={handleDiaAnterior}
              disabled={cargandoDiario}
              title="Día anterior"
            >
              &larr;
            </button>
            <span
              className="badge rounded-pill px-3 py-2 fw-semibold"
              style={{ backgroundColor: '#F1EFEA', color: '#3E100F', fontSize: '0.85rem', minWidth: '130px' }}
            >
              {formatearFecha(fechaSeleccionada)} {esHoy ? '(Hoy)' : ''}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary fw-bold px-2"
              onClick={handleDiaSiguiente}
              disabled={esHoy || cargandoDiario}
              title="Día siguiente"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="card-body p-4" style={{ opacity: cargandoDiario ? 0.6 : 1 }}>
          <div className="row g-4 align-items-center">
            {/* Total Diario */}
            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 bg-light border-start border-4" style={{ borderLeftColor: '#B5865A !important' }}>
                <p className="text-uppercase small text-body-secondary mb-1 fw-semibold">
                  Total de Ventas
                </p>
                <p className="h3 fw-bold mb-1" style={{ color: '#3E100F' }}>
                  {formatearPrecio(diarias.totalDiario || 0)}
                </p>
                <small className="text-muted">
                  {diarias.cantidadVentas} {diarias.cantidadVentas === 1 ? 'venta registrada' : 'ventas registradas'}
                </small>
              </div>
            </div>

            {/* Desglose por Método de Pago */}
            <div className="col-12 col-md-8">
              {diarias.porMetodoPago?.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {diarias.porMetodoPago.map((item, idx) => {
                    const porcentaje = diarias.totalDiario > 0
                      ? Math.round((item.total / diarias.totalDiario) * 100)
                      : 0;

                    return (
                      <div key={idx}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-dark">
                            {item.metodo}{' '}
                            <small className="text-muted fw-normal">
                              ({item.cantidad} {item.cantidad === 1 ? 'venta' : 'ventas'})
                            </small>
                          </span>
                          <span className="fw-bold" style={{ color: '#3E100F' }}>
                            {formatearPrecio(item.total)}{' '}
                            <small className="text-muted fw-normal">({porcentaje}%)</small>
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px', backgroundColor: '#F1EFEA' }}>
                          <div
                            className="progress-bar rounded-pill"
                            role="progressbar"
                            style={{ width: `${porcentaje}%`, backgroundColor: '#B5865A' }}
                            aria-valuenow={porcentaje}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted small py-3">
                  No se registraron ventas en la fecha seleccionada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Distribución por Plan */}
      <div className="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Distribución por Plan de Suscripción</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Plan</th>
                  <th scope="col" className="text-center">Activas</th>
                  <th scope="col" className="text-center">Total Histórico</th>
                  <th scope="col" className="text-end pe-4">Ingresos del Mes</th>
                </tr>
              </thead>
              <tbody>
                {resumen?.distribucionPorPlan?.map((plan) => (
                  <tr key={plan.planId}>
                    <td className="ps-4">
                      <span className="fw-semibold text-dark">{plan.nombre}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: '#B5865A', color: '#FFFFFF', fontSize: '0.85rem' }}>
                        {plan.cantidadActivas}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
                        {plan.cantidadSuscripciones}
                      </span>
                    </td>
                    <td className="text-end pe-4 fw-bold" style={{ color: '#3E100F' }}>
                      {formatearPrecio(plan.ingresos)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fila Doble: Top 3 Métodos de Pago + Top Productos Más Vendidos */}
      <div className="row g-4 mb-4">
        {/* Top 3 Métodos de Pago */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100 rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Top 3 Métodos de Pago Más Usados</h5>
            </div>
            <div className="card-body p-4">
              {resumen?.metodosPagoMasUsados?.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {resumen.metodosPagoMasUsados.map((item, index) => (
                    <div key={index}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-medium text-dark">
                          <span
                            className="badge me-2"
                            style={{ backgroundColor: '#3E100F', color: '#FFFFFF', fontSize: '0.7rem' }}
                          >
                            {index + 1}°
                          </span>
                          {item.metodo}
                        </span>
                        <small className="text-muted fw-semibold">
                          {item.cantidad} ({item.porcentaje}%)
                        </small>
                      </div>
                      <div className="progress" style={{ height: '10px', backgroundColor: '#F1EFEA' }}>
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{ width: `${item.porcentaje}%`, backgroundColor: '#B5865A' }}
                          aria-valuenow={item.porcentaje}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted small">
                  No hay registros de pagos aún.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Productos Más Vendidos */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100 rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Top Productos Más Vendidos</h5>
            </div>
            <div className="card-body p-0">
              {resumen?.topProductos?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">Producto</th>
                        <th scope="col" className="text-center">Unidades</th>
                        <th scope="col" className="text-end pe-4">Total Recaudado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.topProductos.map((prod, idx) => (
                        <tr key={idx}>
                          <td className="ps-4 fw-medium text-dark">{prod.producto}</td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark border px-2 py-1">
                              {prod.unidadesVendidas} un.
                            </span>
                          </td>
                          <td className="text-end pe-4 fw-bold" style={{ color: '#3E100F' }}>
                            {formatearPrecio(prod.totalRecaudado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-muted small">
                  No hay registros de ventas de productos aún.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      {resumen?.proximosEventos?.length > 0 && (
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Próximos Eventos</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              {resumen.proximosEventos.map((ev, i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className="p-3 rounded-2 border-start border-4 bg-light shadow-sm" style={{ borderLeftColor: '#3E100F !important' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#3E100F' }}>{ev.nombre}</h6>
                    <p className="text-muted small mb-2">{formatearFecha(ev.fecha)}</p>
                    <span className="badge px-3 py-1" style={{ backgroundColor: '#B5865A', color: '#FFF' }}>
                      {ev.cupos} Cupos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rendimiento por Evento (Eventos Realizados Activos) */}
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden mb-4">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>
            Rendimiento por Evento
          </h5>
          <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: '#F1EFEA', color: '#3E100F' }}>
            {resumen?.estadisticasPorEvento?.length || 0} eventos
          </span>
        </div>
        <div className="card-body p-0">
          {resumen?.estadisticasPorEvento?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Evento</th>
                    <th scope="col" className="text-end">Total de Ventas</th>
                    <th scope="col">Métodos de Pago</th>
                    <th scope="col" className="pe-4">Vinos mas Vendidos</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.estadisticasPorEvento.map((ev) => (
                    <tr key={ev.eventoId}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{ev.nombre}</div>
                        <small className="text-muted">{formatearFecha(ev.fecha)}</small>
                      </td>

                      <td className="text-end">
                        <div className="fw-bold" style={{ color: '#3E100F' }}>
                          {formatearPrecio(ev.totalRecaudado)}
                        </div>
                        <small className="text-muted">
                          {ev.cantidadVentas} {ev.cantidadVentas === 1 ? 'venta' : 'ventas'}
                        </small>
                      </td>

                      <td>
                        {ev.topMetodosPago?.length > 0 ? (
                          <div className="d-flex flex-column gap-1 py-1">
                            {ev.topMetodosPago.map((mp, idx) => (
                              <div key={idx} className="d-flex align-items-center justify-content-between gap-2 small">
                                <span>
                                  <span
                                    className="badge me-2"
                                    style={{ backgroundColor: '#3E100F', color: '#FFFFFF', fontSize: '0.7rem' }}
                                  >
                                    {idx + 1}°
                                  </span>
                                  <span className="text-dark fw-medium">{mp.metodo}</span>
                                </span>
                                <span className="badge bg-light text-dark border">
                                  {mp.cantidad} pagos
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted fw-semibold">-</span>
                        )}
                      </td>

                      <td className="pe-4">
                        {ev.topVinos?.length > 0 ? (
                          <div className="d-flex flex-column gap-1 py-1">
                            {ev.topVinos.map((vino, idx) => (
                              <div key={idx} className="d-flex align-items-center justify-content-between gap-2 small">
                                <span>
                                  <span
                                    className="badge me-2"
                                    style={{ backgroundColor: '#3E100F', color: '#FFFFFF', fontSize: '0.7rem' }}
                                  >
                                    {idx + 1}°
                                  </span>
                                  <span className="text-dark fw-medium">{vino.producto}</span>
                                </span>
                                <span className="badge bg-light text-dark border">
                                  {vino.unidadesVendidas} un.
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted fw-semibold">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted small">
              Aún no hay eventos realizados registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPage;