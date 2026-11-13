import React from 'react';
import { useNavigate } from 'react-router-dom';

export function TarjetaPlan({ plan }) {
  const navigate = useNavigate();

  const { nombre, descripcion, cantidad_vinos, valor, productos_proximo_mes } = plan;

  const handleSuscribirme = () => {
    navigate(`/suscripciones/${encodeURIComponent(nombre)}`);
  };

  return (
    <div className="card-plan-vip h-100 d-flex flex-column justify-content-between p-4" style={{ boxShadow: '0 10px 8px rgba(0, 0, 0, 0.1)', borderRadius: '18px', backgroundColor: '#fff' }}>
      <div>
        {/* Cabecera */}
        <div className="text-center pb-3 mb-3 border-bottom-sutil">
          <span className="plan-eyebrow d-block mb-2">PLAN MENSUAL</span>
          <h3 className="plan-titulo fw-bold m-0 mb-3">
            {nombre}
          </h3>
          {descripcion && (
            <p className="plan-descripcion text-muted small mb-5 px-2">
              {descripcion}
            </p>
          )}

          {/* Precio */}
          <div className="plan-precio-box mt-2">
            <span className="precio-monto fw-bold">
              ${typeof valor === 'number' ? valor.toLocaleString('es-AR') : valor}
            </span>
            <span className="precio-periodo text-muted small"> / mes</span>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="card-plan-body text-start py-2">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="small fw-semibold text-uppercase" style={{ color: 'var(--titulos, #3E100F)', letterSpacing: '0.5px' }}>
              Selección mensual
            </span>
            <span className="badge-cantidad">
              {cantidad_vinos} {cantidad_vinos === 1 ? 'botella' : 'botellas'}
            </span>
          </div>

          <ul className="lista-vinos-limpia list-unstyled mb-0">
            {productos_proximo_mes && productos_proximo_mes.length > 0 ? (
              productos_proximo_mes.map((producto) => (
                <li key={producto.id} className="d-flex align-items-baseline justify-content-between py-1">
                  <div>
                    <span className="fw-semibold text-dark">{producto.marca}</span>
                    <span className="text-muted ms-1">{producto.varietal}</span>
                  </div>
                  {producto.medida && (
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {producto.medida}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-muted small fst-italic py-1">
                Estamos seleccionando los vinos para el próximo mes.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Botón */}
      <div className="pt-4 mt-2">
        <button 
          className="btn-suscribir-vip w-100 py-2.5 fw-semibold rounded-pill text-white"
          onClick={handleSuscribirme}
        >
          Elegir plan
        </button>
      </div>
    </div>
  );
}

export default TarjetaPlan;