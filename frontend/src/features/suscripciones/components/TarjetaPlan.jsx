import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos } from '../../productos';

export function TarjetaPlan({ plan }) {
  const navigate = useNavigate();
  const [productosDelPlan, setProductosDelPlan] = useState([]);

  const { nombre, descripcion, cantidad_vinos, valor, productos_proximo_mes } = plan;

  useEffect(() => {
    async function cargarVinosDelPlan() {
      try {
        const todosLosProductos = await getProductos();
        const filtrados = todosLosProductos.filter((p) => 
          productos_proximo_mes.includes(p.id)
        );
        setProductosDelPlan(filtrados);
      } catch (error) {
        console.error('Error al cargar los vinos del plan:', error);
      }
    }

    if (productos_proximo_mes && productos_proximo_mes.length > 0) {
      cargarVinosDelPlan();
    }
  }, [productos_proximo_mes]);

  const handleSuscribirme = () => {
    navigate(`/suscripciones/${encodeURIComponent(nombre)}`);
  };

  return (
    <table className="tabla-plan h-100 w-100 m-0">
      <thead>
        <tr>
          <th>PLAN {nombre?.toUpperCase()}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className="text-muted small py-2">
            {descripcion}
          </td>
        </tr>

        <tr>
          <td className="cantidad">
            📦 {cantidad_vinos} {cantidad_vinos === 1 ? 'vino mensual' : 'vinos mensuales'}
          </td>
        </tr>

        <tr>
          <td className="text-start p-3 bg-light">
            <strong className="d-block mb-1">Vinos del próximo mes:</strong>
            <ul className="mb-0 ps-3 small">
              {productosDelPlan.length > 0 ? (
                productosDelPlan.map((producto) => (
                  <li key={producto.id}>
                    {producto.marca} - {producto.varietal} - {producto.medida}
                  </li>
                ))
              ) : (
                <li>Próximamente más novedades</li>
              )}
            </ul>
          </td>
        </tr>

        <tr className="precio">
          <td>
            ${typeof valor === 'number' ? valor.toLocaleString('es-AR') : valor} / mes
          </td>
        </tr>

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