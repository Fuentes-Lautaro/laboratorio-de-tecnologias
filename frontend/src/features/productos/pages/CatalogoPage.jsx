import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import GrillaProductos from '../components/GrillaProductos';
import FiltroDesplegable from '../components/FiltroDesplegable';
import { getProductos } from '../services/productosServices';
import { useFetch } from '../../../shared/hooks/useFetch';
import Boton from '../../../shared/components/Boton';
import Spinner from '../../../shared/components/Spinner';
import MensajeVacio from '../../../shared/components/MensajeVacio';

function CatalogoPage() {
  const { agregarProducto } = useOutletContext();

  // Estados de los filtros desplegables (viajan al backend)
  const [marcasSeleccionadas, setMarcas] = useState([]);
  const [tiposSeleccionados, setTipos] = useState([]);
  const [varietalesSeleccionados, setVarietales] = useState([]);
  const [medidasSeleccionadas, setMedidas] = useState([]);
  const [bodegasSeleccionadas, setBodegas] = useState([]);

  // Estado de búsqueda por texto (filtra en el frontend)
  const [busqueda, setBusqueda] = useState('');

  // Objeto estable que dispara useFetch cada vez que cambia un desplegable
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

  // 1. Carga base sin filtros (para mantener todas las opciones de los desplegables)
  const { datos: todosLosProductos } = useFetch(getProductos);

  // 2. Carga filtrada desde el backend (se re-ejecuta cada vez que cambia paramsBack)
  const { datos: productosBack, cargando, error } = useFetch(getProductos, paramsBack);

  const baseOpciones = todosLosProductos || [];
  const listaBack = productosBack || [];

  // Opciones únicas de los desplegables
  const marcas = useMemo(
    () => [...new Set(baseOpciones.map((p) => p.p_marca || p.marca).filter(Boolean))].sort(),
    [baseOpciones]
  );
  const tipos = useMemo(
    () => [...new Set(baseOpciones.map((p) => p.p_tipo || p.tipo).filter(Boolean))].sort(),
    [baseOpciones]
  );
  const varietales = useMemo(
    () => [...new Set(baseOpciones.map((p) => p.p_varietal || p.varietal).filter(Boolean))].sort(),
    [baseOpciones]
  );
  const bodegas = useMemo(
    () => [...new Set(baseOpciones.map((p) => p.p_bodega || p.bodega).filter(Boolean))].sort(),
    [baseOpciones]
  );
  const medidas = useMemo(
    () => [...new Set(baseOpciones.map((p) => String(p.p_medida || p.medida)).filter(Boolean))].sort(),
    [baseOpciones]
  );

  // Filtrado por texto en el frontend sobre lo que devolvió el backend
  const textoBuscado = busqueda.trim().toLowerCase();
  const productosFiltrados = useMemo(() => {
    if (!textoBuscado) return listaBack;

    return listaBack.filter((p) => {
      const marca = p.p_marca || p.marca || '';
      const tipo = p.p_tipo || p.tipo || '';
      const varietal = p.p_varietal || p.varietal || '';
      const bodega = p.p_bodega || p.bodega || '';

      return (
        marca.toLowerCase().includes(textoBuscado) ||
        tipo.toLowerCase().includes(textoBuscado) ||
        varietal.toLowerCase().includes(textoBuscado) ||
        bodega.toLowerCase().includes(textoBuscado)
      );
    });
  }, [listaBack, textoBuscado]);

  const hayFiltrosActivos = Boolean(paramsBack) || textoBuscado !== '';

  const limpiarFiltros = () => {
    setMarcas([]);
    setTipos([]);
    setVarietales([]);
    setMedidas([]);
    setBodegas([]);
    setBusqueda('');
  };

  if (cargando && !todosLosProductos) return <Spinner texto="Cargando catálogo..." />;
  if (error) return <MensajeVacio titulo="No pudimos cargar el catálogo" texto={error.message} />;

  return (
    <>
      <div className="text-center py-5 max-w-2xl mx-auto">
        <span 
          className="badge rounded-pill px-3 py-2 mb-2 text-uppercase fw-semibold"
          style={{ backgroundColor: 'rgba(181, 134, 90, 0.15)', color: '#B5865A', letterSpacing: '1px' }}
        >
          Nuestros productos
        </span>
        <h1 className="display-5 fw-bold mb-1" style={{ color: '#3E100F' }}>
          Catálogo
        </h1>
        <p className="text-secondary lead fs-6">
          Descubrí nuestros productos y sentí el placer por el buen vino.
        </p>
      </div>

      <div className="row g-3">
        <aside className="col-lg-3 d-flex flex-column gap-1">
          <label htmlFor="busqueda" className="rotulo-filtro mb-2">
            Buscar
          </label>
          <input
            id="busqueda"
            type="search"
            className="form-control input-busqueda campo-busqueda-tag mb-2"
            placeholder="Ej: Trapiche"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <FiltroDesplegable
            titulo="Marcas"
            opciones={marcas}
            seleccionados={marcasSeleccionadas}
            onCambio={setMarcas}
          />

          <FiltroDesplegable
            titulo="Tipos"
            opciones={tipos}
            seleccionados={tiposSeleccionados}
            onCambio={setTipos}
          />

          <FiltroDesplegable
            titulo="Varietal"
            opciones={varietales}
            seleccionados={varietalesSeleccionados}
            onCambio={setVarietales}
          />

          <FiltroDesplegable
            titulo="Bodega"
            opciones={bodegas}
            seleccionados={bodegasSeleccionadas}
            onCambio={setBodegas}
          />

          <FiltroDesplegable
            titulo="Medida"
            opciones={medidas}
            seleccionados={medidasSeleccionadas}
            onCambio={setMedidas}
          />

          {hayFiltrosActivos && (
            <Boton
              variante="outline-secondary"
              tamanio="sm"
              className="boton-error mt-2"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </Boton>
          )}
        </aside>

        <section className="col-lg-9">
          <p className="small text-body-secondary">
            {cargando
              ? 'Actualizando resultados...'
              : `Mostrando ${productosFiltrados.length} de ${baseOpciones.length} productos`}
          </p>

          {productosFiltrados.length > 0 ? (
            <GrillaProductos productos={productosFiltrados} onAgregar={agregarProducto} />
          ) : (
            <MensajeVacio titulo="No hay productos con esos filtros" texto="Pruebe con otros filtros">
              <Boton onClick={limpiarFiltros} className="boton-error">Ver todo</Boton>
            </MensajeVacio>
          )}
        </section>
      </div>
    </>
  );
}

export default CatalogoPage;