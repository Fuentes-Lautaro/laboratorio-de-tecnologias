import { capitalizar } from '../../../shared/utils/formato'

function FiltroMarcas({ marcas, seleccionada, onSeleccionar }) {
  return (
    <div className="mb-4">
      <span className="rotulo-filtro">Marcas</span>
      <div className="lista-categorias-tag">
        {['todas', ...marcas].map((marca) => (
          <button
            key={marca}
            type="button"
            className={marca === seleccionada ? 'activa' : ''}
            aria-pressed={marca === seleccionada}
            onClick={() => onSeleccionar(marca)}
          >
            {capitalizar(marca)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FiltroMarcas
