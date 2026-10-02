function Boton({ variante = 'dark', tamanio, className = '', children, ...resto }) {
  const clases = ['btn', `btn-${variante}`, tamanio && `btn-${tamanio}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={clases} {...resto}>
      {children}
    </button>
  )
}

export default Boton
