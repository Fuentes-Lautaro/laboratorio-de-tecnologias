import { capitalizar } from '../../../shared/utils/formato'

// Componente controlado: no guarda estado propio. Muestra lo que recibe
// (seleccionada) y avisa los cambios (onSeleccionar).
function FiltroCategorias({ categorias, seleccionada, onSeleccionar }) {
  return (
    <div className="mb-4">
      <span className="rotulo-filtro">Categorías</span>
      <div className="lista-categorias-tag">
        {['todas', ...categorias].map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={categoria === seleccionada ? 'activa' : ''}
            aria-pressed={categoria === seleccionada}
            onClick={() => onSeleccionar(categoria)}
          >
            {capitalizar(categoria)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FiltroCategorias
