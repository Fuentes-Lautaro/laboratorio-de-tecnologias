// La tarjeta contenedora de la clase 2 (diseño B): aporta el marco, children el contenido.
function Tarjeta({ titulo, children, className = '' }) {
  return (
    <div className={`card shadow-sm ${className}`}>
      {titulo && <div className="card-header fw-bold bg-white">{titulo}</div>}
      <div className="card-body">{children}</div>
    </div>
  )
}

export default Tarjeta
