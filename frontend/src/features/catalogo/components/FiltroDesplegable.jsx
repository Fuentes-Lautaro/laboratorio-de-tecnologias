import { useState, useRef } from 'react'

function FiltroDesplegable({ titulo, opciones = [], seleccionados = [], onCambio }) {
  const [abierto, setAbierto] = useState(false)
  const timeoutRef = useRef(null)

  const toggleOpcion = (opcion) => {
    if (seleccionados.includes(opcion)) {
      onCambio(seleccionados.filter((item) => item !== opcion))
    } else {
      onCambio([...seleccionados, opcion])
    }
  }

  return (
    <div className="dropdown" onMouseLeave={() =>setAbierto(false)}>
      <span className="rotulo-filtro d-block mb-2">{titulo}</span>
      <button
        className="btn boton-filtro dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" 
        type="button" 
        onClick={() => setAbierto(!abierto)}
      >
        <span>
          {seleccionados.length === 0 
            ? `Todos los ${titulo.toLowerCase()}` 
            : `${seleccionados.length} seleccionados`}
        </span>
      </button>

      {abierto && (
        <ul className="dropdown-menu menu-desplegable show p-3 w-100  mt-1 ">
          {opciones.map((opcion) => {
            const estaSeleccionado = seleccionados.includes(opcion)
            return (
              <li key={opcion} className="form-check py-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`filtro-${titulo}-${opcion}`}
                  checked={estaSeleccionado}
                  onChange={() => toggleOpcion(opcion)}
                />
                <label className="form-check-label w-100" htmlFor={`filtro-${titulo}-${opcion}`}>
                  {opcion}
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FiltroDesplegable