import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import GrillaProductos from '../components/GrillaProductos';
import FiltroDesplegable from '../components/FiltroDesplegable';
import { getProductos } from '../services/productosServices';
import { useFetch } from '../../../shared/hooks/useFetch';
import Boton from '../../../shared/components/Boton';
import Spinner from '../../../shared/components/Spinner';
import MensajeVacio from '../../../shared/components/MensajeVacio';

const LIMITE_POR_PAGINA = 30;

function CatalogoPage() {
  const { agregarProducto } = useOutletContext();

  const [marcasSeleccionadas, setMarcas] = useState([]);
  const [tiposSeleccionados, setTipos] = useState([]);
  const [varietalesSeleccionados, setVarietales] = useState([]);
  const [medidasSeleccionadas, setMedidas] = useState([]);
  const [bodegasSeleccionadas, setBodegas] = useState([]);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setPagina(1);
  }, [
    marcasSeleccionadas,
    tiposSeleccionados,
    varietalesSeleccionados,
    medidasSeleccionadas,
    bodegasSeleccionadas,
  ]);

  const paramsBack = useMemo(() => {
    const params = {
      page: pagina,
      limit: LIMITE_POR_PAGINA,
    };

    if (marcasSeleccionadas.length > 0) params.marca = marcasSeleccionadas;
    if (tiposSeleccionados.length > 0) params.tipo = tiposSeleccionados;
    if (varietalesSeleccionados.length > 0) params.varietal = varietalesSeleccionados;
    if (medidasSeleccionadas.length > 0) params.medida = medidasSeleccionadas;
    if (bodegasSeleccionadas.length > 0) params.bodega = bodegasSeleccionadas;

    return params;
  }, [
    pagina,
    marcasSeleccionadas,
    tiposSeleccionados,
    varietalesSeleccionados,
    medidasSeleccionadas,
    bodegasSeleccionadas,
  ]);

  const { datos: todosLosProductos } = useFetch(getProductos);
  const { datos: respuestaPaginada, cargando, error } = useFetch(getProductos, paramsBack);

  const baseOpciones = todosLosProductos || [];
  const listaProductos = respuestaPaginada?.productos || [];
  const totalRegistros = respuestaPaginada?.total ?? 0;
  const totalPaginas = respuestaPaginada?.totalPaginas ?? 1;

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

  const hayFiltrosActivos =
    marcasSeleccionadas.length > 0 ||
    tiposSeleccionados.length > 0 ||
    varietalesSeleccionados.length > 0 ||
    medidasSeleccionadas.length > 0 ||
    bodegasSeleccionadas.length > 0;

  const limpiarFiltros = () => {
    setMarcas([]);
    setTipos([]);
    setVarietales([]);
    setMedidas([]);
    setBodegas([]);
    setPagina(1);
  };

  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cargando && !todosLosProductos) return <Spinner texto="Cargando catálogo..." />;
  if (error) return <MensajeVacio titulo="No pudimos cargar el catálogo" texto={error.message} />;

  return (
    <>
      <div className="text-center py-4 max-w-2xl mx-auto">
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

      {/* BARRA HORIZONTAL DE FILTROS */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 mb-3 rounded-3 bg-light border">
        <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
          <FiltroDesplegable titulo="Marca" opciones={marcas} seleccionados={marcasSeleccionadas} onCambio={setMarcas} />
          <FiltroDesplegable titulo="Tipo" opciones={tipos} seleccionados={tiposSeleccionados} onCambio={setTipos} />
          <FiltroDesplegable titulo="Varietal" opciones={varietales} seleccionados={varietalesSeleccionados} onCambio={setVarietales} />
          <FiltroDesplegable titulo="Bodega" opciones={bodegas} seleccionados={bodegasSeleccionadas} onCambio={setBodegas} />
          <FiltroDesplegable titulo="Medida" opciones={medidas} seleccionados={medidasSeleccionadas} onCambio={setMedidas} />

          {hayFiltrosActivos && (
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none text-danger fw-semibold px-2"
              onClick={limpiarFiltros}
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        <span className="small text-body-secondary text-nowrap">
          {cargando
            ? 'Actualizando...'
            : `Mostrando ${listaProductos.length} de ${totalRegistros} productos (Pág. ${pagina} de ${totalPaginas})`}
        </span>
      </div>

      {/* GRILLA CON ESPACIADO INFERIOR */}
      <section className="pb-5 mb-4">
        {listaProductos.length > 0 ? (
          <GrillaProductos productos={listaProductos} onAgregar={agregarProducto} />
        ) : (
          <MensajeVacio titulo="No hay productos con esos filtros" texto="Pruebe con otros filtros">
            <Boton onClick={limpiarFiltros} className="boton-error">
              Ver todo
            </Boton>
          </MensajeVacio>
        )}

        {totalPaginas > 1 && (
          <nav aria-label="Paginación de catálogo" className="d-flex justify-content-center mt-5">
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pagina <= 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(pagina - 1)}
                  disabled={pagina <= 1}
                  style={{ color: '#3E100F' }}
                >
                  Anterior
                </button>
              </li>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <li key={num} className={`page-item ${pagina === num ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => cambiarPagina(num)}
                    style={
                      pagina === num
                        ? { backgroundColor: '#64141B', borderColor: '#64141B', color: '#FFFFFF' }
                        : { color: '#3E100F' }
                    }
                  >
                    {num}
                  </button>
                </li>
              ))}

              <li className={`page-item ${pagina >= totalPaginas ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(pagina + 1)}
                  disabled={pagina >= totalPaginas}
                  style={{ color: '#3E100F' }}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </>
  );
}

export default CatalogoPage;