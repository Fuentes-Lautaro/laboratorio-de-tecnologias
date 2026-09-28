import { useState } from 'react'

export function useFiltros(productos) {
  const [marcasSeleccionadas, setMarcas] = useState([])
  const [tiposSeleccionados, setTipos] = useState([])
  const [varietalesSeleccionados, setVarietales] = useState([])
  const [medidasSeleccionadas, setMedidas] = useState([])
  const [bodegasSeleccionadas, setBodegas] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const lista = productos ?? []

  const marcas = [...new Set(lista.map((p) => p.marca))]            //filtro las marcas que hay al menos 1 en stock
  const tipos = [...new Set(lista.map((p) => p.tipo))]              //filtro los tipos que hay al menos 1 en stock
  const medidas = [...new Set(lista.map((p) => p.medida))]          //filtro las medidas que hay al menos 1 en stock
  const bodegas = [...new Set(lista.map((p) => p.bodega))]          //filtro las bodegas que hay al menos 1 en stock
  const varietales = [...new Set(lista.map((p) => p.varietal))]     //filtro los varietales que hay al menos 1 en stock

  const textoBuscado = busqueda.trim().toLowerCase()                //convierte a minuscula todo lo que el usuario escriba en el buscador

  const productosFiltrados = lista.filter(
    (p) =>
      (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(p.marca)) &&
      (tiposSeleccionados.length === 0 || tiposSeleccionados.includes(p.tipo)) &&
      (varietalesSeleccionados.length === 0 || varietalesSeleccionados.includes(p.varietal)) &&
      (medidasSeleccionadas.length === 0 || medidasSeleccionadas.includes(p.medida)) &&
      (bodegasSeleccionadas.length === 0 || bodegasSeleccionadas.includes(p.bodega)) &&
      p.marca.toLowerCase().includes(textoBuscado),
  )

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
    marcasSeleccionadas,
    tiposSeleccionados,
    varietalesSeleccionados,
    medidasSeleccionadas,
    bodegasSeleccionadas,
    productosFiltrados,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}
