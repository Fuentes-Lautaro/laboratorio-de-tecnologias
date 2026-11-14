import { useState, useRef, useEffect } from 'react';

function FiltroDesplegable({ titulo, opciones = [], seleccionados = [], onCambio }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    const manejarClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClicFuera);
    return () => document.removeEventListener('mousedown', manejarClicFuera);
  }, []);

  const toggleOpcion = (opcion) => {
    if (seleccionados.includes(opcion)) {
      onCambio(seleccionados.filter((item) => item !== opcion));
    } else {
      onCambio([...seleccionados, opcion]);
    }
  };

  const haySeleccion = seleccionados.length > 0;

  return (
    <div className="dropdown position-relative" ref={contenedorRef}>
      <button
        className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-1.5 rounded-2 shadow-sm"
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        style={{
          backgroundColor: haySeleccion ? 'rgba(181, 134, 90, 0.15)' : '#FFFFFF',
          border: haySeleccion ? '1px solid #B5865A' : '1px solid #DEE2E6',
          color: '#3E100F',
          fontSize: '0.85rem',
          fontWeight: haySeleccion ? '600' : '500',
        }}
      >
        <span>{titulo}</span>
        {haySeleccion && (
          <span
            className="badge rounded-pill text-white"
            style={{ backgroundColor: '#64141B', fontSize: '0.7rem' }}
          >
            {seleccionados.length}
          </span>
        )}
      </button>

      {abierto && (
        <ul
          className="dropdown-menu show p-2 mt-1 shadow border-0 rounded-3"
          style={{
            minWidth: '210px',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 1050,
          }}
        >
          {opciones.length === 0 ? (
            <li className="text-muted small px-2 py-1">Sin opciones</li>
          ) : (
            opciones.map((opcion) => {
              const estaSeleccionado = seleccionados.includes(opcion);
              return (
                <li key={opcion} className="form-check px-2 py-1 ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`filtro-${titulo}-${opcion}`}
                    checked={estaSeleccionado}
                    onChange={() => toggleOpcion(opcion)}
                  />
                  <label
                    className="form-check-label small w-100"
                    htmlFor={`filtro-${titulo}-${opcion}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {opcion}
                  </label>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

export default FiltroDesplegable;