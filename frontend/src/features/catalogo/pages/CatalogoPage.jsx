import { useOutletContext } from 'react-router'
import GrillaProductos from '../components/GrillaProductos'
import FiltroDesplegable from '../components/FiltroDesplegable'
import { useFiltros } from '../hooks/useFiltros'
import { obtenerProductos } from '../services/catalogoServices'
import { useFetch } from '../../../shared/hooks/useFetch'
import Boton from '../../../shared/components/Boton'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'

function CatalogoPage() {
  const { agregarProducto } = useOutletContext()
  const { datos: productos, cargando, error } = useFetch(obtenerProductos)
  const filtros = useFiltros(productos)

  if (cargando) return <Spinner texto="Cargando catálogo..." />
  if (error) return <MensajeVacio titulo="No pudimos cargar el catálogo" texto={error.message} />
  
  return (
    <>
      <header className="mb-4">
        <h1 className="h2 mb-1 titulo-catalogo b">Catálogo</h1>
        <p className="text-body-secondary mb-0">Filtrá por marca, tipo, varietal, bodega y medida.</p>
      </header>

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
            value={filtros.busqueda}
            onChange={(e) => filtros.setBusqueda(e.target.value)}
          />

          <FiltroDesplegable
            titulo="Marcas"
            opciones={filtros.marcas}
            seleccionados={filtros.marcasSeleccionadas}
            onCambio={filtros.setMarcas}
          />

          <FiltroDesplegable
            titulo="Tipos"
            opciones={filtros.tipos}
            seleccionados={filtros.tiposSeleccionados}
            onCambio={filtros.setTipos}
          />

          <FiltroDesplegable
            titulo="Varietal"
            opciones={filtros.varietales}
            seleccionados={filtros.varietalesSeleccionados}
            onCambio={filtros.setVarietales}
          />

          <FiltroDesplegable
            titulo="Bodega"
            opciones={filtros.bodegas}
            seleccionados={filtros.bodegasSeleccionadas}
            onCambio={filtros.setBodegas}
          />

          <FiltroDesplegable
            titulo="Medida"
            opciones={filtros.medidas}
            seleccionados={filtros.medidasSeleccionadas}
            onCambio={filtros.setMedidas}
          />

          {filtros.hayFiltrosActivos && (
            <Boton
              variante="outline-secondary"
              tamanio="sm"
              className="boton-error"
              onClick={filtros.limpiarFiltros}
            >
              Limpiar filtros
            </Boton>
          )}
        </aside>

        <section className="col-lg-9">
          <p className="small text-body-secondary">
            Mostrando {filtros.productosFiltrados.length} de {productos.length} productos
          </p>

          {filtros.productosFiltrados.length > 0 ? (
            <GrillaProductos productos={filtros.productosFiltrados} onAgregar={agregarProducto} />
          ) : (
            <MensajeVacio titulo="No hay productos con esos filtros" texto="Pruebe con otros filtros">
              <Boton onClick={filtros.limpiarFiltros} className='boton-error'>Ver todo</Boton>
            </MensajeVacio>
          )}
        </section>
      </div>
    </>
    )
}

export default CatalogoPage