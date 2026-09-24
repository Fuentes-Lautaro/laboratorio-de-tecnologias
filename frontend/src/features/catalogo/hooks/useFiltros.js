import { useState } from 'react'

const ORDEN_TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// CLASE 3 · Reutilizar lógica con hooks personalizados
export function useFiltros(productos) {
  const [categoria, setCategoria] = useState('todas')
  const [talle, setTalle] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  // CLASE 3 · Elegir la estructura del estado: evitar estado redundante
  // Solo se guardan las ELECCIONES del usuario. Las categorías disponibles,
  // los talles y la lista filtrada se CALCULAN en cada render a partir de ellas.
  // Si los guardáramos en otro useState habría que mantenerlos sincronizados a mano.
  const lista = productos ?? []
  const categorias = [...new Set(lista.map((p) => p.categoria))]
  const talles = ORDEN_TALLES.filter((t) => lista.some((p) => p.talles.includes(t)))
  const textoBuscado = busqueda.trim().toLowerCase()

  const productosFiltrados = lista.filter(
    (p) =>
      (categoria === 'todas' || p.categoria === categoria) &&
      (talle === 'todos' || p.talles.includes(talle)) &&
      p.nombre.toLowerCase().includes(textoBuscado),
  )

  const hayFiltrosActivos = categoria !== 'todas' || talle !== 'todos' || textoBuscado !== ''

  function limpiarFiltros() {
    setCategoria('todas')
    setTalle('todos')
    setBusqueda('')
  }

  return {
    categoria,
    setCategoria,
    talle,
    setTalle,
    busqueda,
    setBusqueda,
    categorias,
    talles,
    productosFiltrados,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}
