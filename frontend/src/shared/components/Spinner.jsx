function Spinner({ texto = 'Cargando...' }) {
  return (
    <div className="d-flex flex-column align-items-center py-5" role="status">
      <div className="spinner-border text-dark mb-3" aria-hidden="true"></div>
      <span className="text-body-secondary">{texto}</span>
    </div>
  )
}

export default Spinner