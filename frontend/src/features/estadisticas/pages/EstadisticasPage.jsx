import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { obtenerResumen } from '../services/estadisticasService';
import { formatearPrecio } from '../../../shared/utils/formato';

export function EstadisticasPage() {
  const { usuario } = useOutletContext() || { usuario: { nombre: 'Usuario' } };
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    obtenerResumen()
      .then((data) => {
        if (isMounted) setResumen(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setCargando(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <div className="container-fluid py-3">
      {/* Encabezado */}
      <header className="mb-4">
        <h1 className="h3 mb-1 fw-bold" style={{ color: '#3E100F' }}>Hola, {usuario.nombre}</h1>
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
                  <th scope="col" className="text-center">Suscripciones</th>
                  <th scope="col" className="text-end pe-4">Ingresos</th>
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

      {/* Fila Doble: Métodos de Pago + Top Productos Más Vendidos */}
      <div className="row g-4 mb-4">
        {/* Métodos de Pago */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100 rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Métodos de Pago Más Usados</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                {resumen?.metodosPagoMasUsados?.map((item, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-medium text-dark">{item.metodo}</span>
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
            <h5 className="mb-0 fw-bold fs-6" style={{ color: '#3E100F' }}>Próximos Eventos & Cupos</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              {resumen.proximosEventos.map((ev, i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className="p-3 rounded-2 border-start border-4 bg-light shadow-sm" style={{ borderLeftColor: '#3E100F !important' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#3E100F' }}>{ev.nombre}</h6>
                    <p className="text-muted small mb-2">📅 {new Date(ev.fecha).toLocaleDateString('es-AR')}</p>
                    <span className="badge px-3 py-1" style={{ backgroundColor: '#B5865A', color: '#FFF' }}>
                      👥 {ev.cupos} Cupos Totales
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstadisticasPage;