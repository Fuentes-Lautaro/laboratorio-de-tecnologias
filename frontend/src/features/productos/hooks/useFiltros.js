import { useState, useMemo } from 'react';

export function useFiltros(productos = [], productosOpciones = null) {
  const [marcasSeleccionadas, setMarcas] = useState([]);
  const [tiposSeleccionados, setTipos] = useState([]);
  const [varietalesSeleccionados, setVarietales] = useState([]);
  const [medidasSeleccionadas, setMedidas] = useState([]);
  const [bodegasSeleccionadas, setBodegas] = useState([]);

  const lista = productos ?? [];
  const fuenteOpciones = productosOpciones ?? lista;

  const marcas = useMemo(
    () => [...new Set(fuenteOpciones.map((p) => p.p_marca || p.marca).filter(Boolean))].sort(),
    [fuenteOpciones]
  );
  const tipos = useMemo(
    () => [...new Set(fuenteOpciones.map((p) => p.p_tipo || p.tipo).filter(Boolean))].sort(),
    [fuenteOpciones]
  );
  const varietales = useMemo(
    () => [...new Set(fuenteOpciones.map((p) => p.p_varietal || p.varietal).filter(Boolean))].sort(),
    [fuenteOpciones]
  );
  const bodegas = useMemo(
    () => [...new Set(fuenteOpciones.map((p) => p.p_bodega || p.bodega).filter(Boolean))].sort(),
    [fuenteOpciones]
  );
  const medidas = useMemo(
    () => [...new Set(fuenteOpciones.map((p) => String(p.p_medida || p.medida)).filter(Boolean))].sort(),
    [fuenteOpciones]
  );

  const paramsBack = useMemo(() => {
    const tieneFiltros =
      marcasSeleccionadas.length > 0 ||
      tiposSeleccionados.length > 0 ||
      varietalesSeleccionados.length > 0 ||
      medidasSeleccionadas.length > 0 ||
      bodegasSeleccionadas.length > 0;

    if (!tieneFiltros) return undefined;

    return {
      marca: marcasSeleccionadas,
      tipo: tiposSeleccionados,
      varietal: varietalesSeleccionados,
      medida: medidasSeleccionadas,
      bodega: bodegasSeleccionadas,
    };
  }, [
    marcasSeleccionadas,
    tiposSeleccionados,
    varietalesSeleccionados,
    medidasSeleccionadas,
    bodegasSeleccionadas,
  ]);

  const hayFiltrosActivos = Boolean(paramsBack);

  function limpiarFiltros() {
    setMarcas([]);
    setTipos([]);
    setVarietales([]);
    setMedidas([]);
    setBodegas([]);
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
    paramsBack,
    productosFiltrados: lista,
    hayFiltrosActivos,
    limpiarFiltros,
  };
}