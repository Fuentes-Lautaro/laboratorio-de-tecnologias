import { useState } from 'react'

export function useFiltros(productos) {
  const [marcasSeleccionadas, setMarcas] = useState([])
  const [tiposSeleccionados, setTipos] = useState([])
  const [varietalesSeleccionados, setVarietales] = useState([])
  const [medidasSeleccionadas, setMedidas] = useState([])
  const [bodegasSeleccionadas, setBodegas] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const lista = productos ?? []

  // Extraemos las opciones únicas soportando tanto prefijo `p_` como formato plano
  const marcas = [...new Set(lista.map((p) => p.p_marca || p.marca).filter(Boolean))].sort()
  const tipos = [...new Set(lista.map((p) => p.p_tipo || p.tipo).filter(Boolean))].sort()
  const varietales = [...new Set(lista.map((p) => p.p_varietal || p.varietal).filter(Boolean))].sort()
  const bodegas = [...new Set(lista.map((p) => p.p_bodega || p.bodega).filter(Boolean))].sort()
  const medidas = [...new Set(lista.map((p) => String(p.p_medida || p.medida)).filter(Boolean))].sort()

  const textoBuscado = busqueda.trim().toLowerCase()

  const productosFiltrados = lista.filter((p) => {
    // Normalizamos la lectura de los campos
    const marca = p.p_marca || p.marca || ''
    const tipo = p.p_tipo || p.tipo || ''
    const varietal = p.p_varietal || p.varietal || ''
    const bodega = p.p_bodega || p.bodega || ''
    const medida = String(p.p_medida || p.medida || '')

    // Validación de selecciones desplegables
    const coincideMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marca)
    const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(tipo)
    const coincideVarietal = varietalesSeleccionados.length === 0 || varietalesSeleccionados.includes(varietal)
    const coincideBodega = bodegasSeleccionadas.length === 0 || bodegasSeleccionadas.includes(bodega)
    const coincideMedida = medidasSeleccionadas.length === 0 || medidasSeleccionadas.includes(medida)

    // Validación de la búsqueda general por texto
    const coincideBusqueda =
      !textoBuscado ||
      marca.toLowerCase().includes(textoBuscado) ||
      tipo.toLowerCase().includes(textoBuscado) ||
      varietal.toLowerCase().includes(textoBuscado) ||
      bodega.toLowerCase().includes(textoBuscado)

    return (
      coincideMarca &&
      coincideTipo &&
      coincideVarietal &&
      coincideBodega &&
      coincideMedida &&
      coincideBusqueda
    )
  })

  const hayFiltrosActivos =
    marcasSeleccionadas.length > 0 ||
    tiposSeleccionados.length > 0 ||
    varietalesSeleccionados.length > 0 ||
    medidasSeleccionadas.length > 0 ||
    bodegasSeleccionadas.length > 0 ||
    textoBuscado !== ''

  function limpiarFiltros() {
    setMarcas([])
    setTipos([])
    setVarietales([])
    setMedidas([])
    setBodegas([])
    setBusqueda('')
  }

  return {
    marcasSeleccionadas,
    setMarcas,
    marcas,
    tiposSeleccionados,
    setTipos,
    tipos,
    varietalesSeleccionados,
    setVarietales,
    varietales,
    medidasSeleccionadas,
    setMedidas,
    medidas,
    bodegasSeleccionadas,
    setBodegas,
    bodegas,
    busqueda,
    setBusqueda,
    productosFiltrados,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}