import React from 'react';
import { useNavigate } from 'react-router-dom';

export function TarjetaPlan({ plan, onVerDetalle }) {

  const navigate = useNavigate();

  const { Nombre, CantidadVinos, tipos, valor } = plan;
  const handleSuscribirme = () => {
    // Redirige a /suscripciones/NombreDelPlan (ej: /planesSuscripciones/Esencial)
    navigate(`/suscripciones/${encodeURIComponent(plan.Nombre)}`);
  };

  return (
    <table className="tabla-plan">
      <thead>
        <tr>
          <th>PLAN {Nombre?.toUpperCase()}</th>
        </tr>
      </thead>

      <tbody>
        {/* Cantidad de vinos */}
        <tr>
          <td className="cantidad">
            {CantidadVinos} {CantidadVinos === 1 ? 'vino mensual' : 'vinos mensuales'}
          </td>
        </tr>

        {/* Tipos disponibles */}
        <tr>
          <td>
            <strong>Tipos disponibles:</strong>
            <br />
            {tipos && tipos.length > 0 ? tipos.join(', ') : 'No especificado'}
          </td>
        </tr>

        {/* Precio */}
        <tr className="precio">
          <td>
            ${typeof valor === 'number' ? valor.toLocaleString('es-AR') : valor} / mes
          </td>
        </tr>

        {/* Botón de acción */}
        <tr className="fila-botones">
          <td>
            <button 
              className="btn-tabla" 
              onClick={handleSuscribirme}
            >
              Suscribirme
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default TarjetaPlan;