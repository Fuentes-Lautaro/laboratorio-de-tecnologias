function MensajeVacio({ titulo, texto, children }) {
  return (
    <div className="text-center py-5 px-3 border rounded-3 bg-body-tertiary">
      <h2 className="h5 mb-2">{titulo}</h2>
      {texto && <p className="text-body-secondary mb-3">{texto}</p>}
      {children}
    </div>
  )
}

export default MensajeVacio
