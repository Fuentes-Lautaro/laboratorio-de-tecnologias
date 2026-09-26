import { useState, useRef } from 'react'

function FiltroDesplegable({ titulo, opciones = [], seleccionados = [], onCambio }) {
    const [abierto, setAbierto] = useState(false)
    const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAbierto(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAbierto(false)
    }, 200)
  }

  const toggleOpcion = (opcion) => {            //deteccion si la opcion ya estaba marcada (se desmarca) o si la quiere marcar
    if (seleccionados.includes(opcion)) {
      onCambio(seleccionados.filter((item) => item !== opcion))
    } else {
      onCambio([...seleccionados, opcion])
    }
  }

  return (
    <div className="dropdown" onMouseLeave={() =>setAbierto(false)}>
      <span className="rotulo-filtro d-block mb-2">{titulo}</span>
      <button  //boton de apertura del menu
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
          {opciones.map((opcion) => {       //por cada opcion, la agrega a la lista con un checkbox para marcar
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