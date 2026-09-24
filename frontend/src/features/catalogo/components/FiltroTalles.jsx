function FiltroTalles({ talles, seleccionado, onSeleccionar }) {
  return (
    <div className="mb-4">
      <span className="rotulo-filtro">Talles</span>
      <div className="chips-talles-tag">
        {['todos', ...talles].map((talle) => {
          const activo = talle === seleccionado
          return (
            <button
              key={talle}
              type="button"
              className={`chip-talle-tag ${activo ? 'activo' : ''}`}
              aria-pressed={activo}
              onClick={() => onSeleccionar(talle)}
            >
              {talle === 'todos' ? 'Todos' : talle}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FiltroTalles
