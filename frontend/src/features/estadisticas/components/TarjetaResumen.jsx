function TarjetaResumen({ titulo, valor, detalle, color = 'dark' }) {
  return (
    <div className={`card h-100 shadow-sm border-0 border-start border-4 border-${color}`}>
      <div className="card-body">
        <p className="text-uppercase small text-body-secondary mb-1">{titulo}</p>
        <p className="h3 fw-bold mb-1">{valor}</p>
        {detalle && <p className="small text-body-secondary mb-0">{detalle}</p>}
      </div>
    </div>
  )
}

export default TarjetaResumen
