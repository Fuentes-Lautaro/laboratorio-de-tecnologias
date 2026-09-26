function FiltroTipos({ tipos, seleccionado, onSeleccionar }) {
  return (
    <div className="mb-4">
      <span className="rotulo-filtro">Tipos</span>
      <div className="chips-talles-tag">
        {['todos', ...tipos].map((tipo) => {
          const activo = tipo === seleccionado
          return (
            <button
              key={tipo}
              type="button"
              className={`chip-talle-tag ${activo ? 'activo' : ''}`}
              aria-pressed={activo}
              onClick={() => onSeleccionar(tipo)}
            >
              {tipo === 'todos' ? 'Todos' : tipo}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FiltroTipos
