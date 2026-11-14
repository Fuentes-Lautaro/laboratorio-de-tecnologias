import React, { useState, useEffect, useCallback } from 'react';
import ProductoCard from '../components/ProductoCard';
import FiltroDesplegable from '../components/FiltroDesplegable';
import Boton from '../../../shared/components/Boton';
import { useFiltros } from '../hooks/useFiltros';
import { 
  getProductos, 
  crearProducto, 
  actualizarProducto, 
  alternarEstadoProducto 
} from '../services/productosServices';

const FORM_INICIAL = { 
  id: '', marca: '', tipo: '', precio: '', costo: '', anio: '',
  medida: '', varietal: '', bodega: '', descripcion: '', img: '', stock: 0 
};

export function ProductosPagePrivada() {
  const [productos, setProductos] = useState([]);
  const [productosOpciones, setProductosOpciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAAlternar, setProductoAAlternar] = useState(null);

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [alerta, setAlerta] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  // Hook de filtros compartido con Catálogo
  const filtros = useFiltros(productos, productosOpciones);

  const mostrarNotificacion = (texto, tipo = 'success') => {
    setAlerta({ texto, tipo });
    setTimeout(() => {
      setAlerta(null);
    }, 3500);
  };

  // Carga las opciones completas de los desplegables sin filtrar
  const cargarOpcionesBase = useCallback(async () => {
    try {
      const todos = await getProductos();
      setProductosOpciones(todos || []);
    } catch (err) {
      console.error('Error al cargar opciones de filtro:', err);
    }
  }, []);

  // Carga los productos enviando los filtros desplegables al backend
  const cargarLista = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getProductos(filtros.paramsBack);
      setProductos(data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      mostrarNotificacion('Error al cargar la lista de productos: ' + err.message, 'danger');
    } finally {
      setCargando(false);
    }
  }, [filtros.paramsBack]);

  useEffect(() => {
    cargarOpcionesBase();
  }, [cargarOpcionesBase]);

  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  const handleAbrirCrear = () => {
    setProductoEditando(null);
    setFormData(FORM_INICIAL);
    setErrorModal(null);
    setMostrarModalForm(true);
  };

  const handleAbrirEditar = (producto) => {
    setProductoEditando(producto);
    setErrorModal(null);
    setFormData({
      id: producto.p_id || producto.id || '',
      marca: producto.p_marca || producto.marca || '',
      tipo: producto.p_tipo || producto.tipo || '',
      precio: producto.p_precio || producto.precio || '',
      costo: producto.p_costo || producto.costo || '',
      anio: producto.p_anio || producto.anio || '',
      medida: producto.p_medida || producto.medida || '',
      bodega: producto.p_bodega || producto.bodega || '',
      varietal: producto.p_varietal || producto.varietal || '',
      stock: producto.p_stock ?? producto.stock ?? 0,
      img: producto.p_imagen_url || producto.p_img || producto.img || '',
      descripcion: producto.p_descripcion || producto.descripcion || '',
    });
    setMostrarModalForm(true);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorModal) setErrorModal(null);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorModal(null);

    try {
      if (productoEditando) {
        const id = productoEditando.p_id || productoEditando.id || formData.id;
        await actualizarProducto(id, formData);
        mostrarNotificacion('¡Producto modificado con éxito!', 'success');
      } else {
        await crearProducto(formData);
        mostrarNotificacion('¡Producto creado con éxito!', 'success');
      }
      setMostrarModalForm(false);
      cargarLista();
      cargarOpcionesBase();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrorModal({
        texto: error.message,
        productoInactivo: error.productoInactivo || null
      });
    }
  };

  const handleReactivarDesdeModal = async () => {
    const prodInactivo = errorModal?.productoInactivo;
    if (!prodInactivo) return;

    const id = prodInactivo.p_id || prodInactivo.id;
    try {
      await alternarEstadoProducto(id);
      setErrorModal(null);
      setMostrarModalForm(false);
      mostrarNotificacion('¡El producto existente fue reactivado con éxito!', 'success');
      cargarLista();
    } catch (error) {
      setErrorModal({ texto: 'Error al reactivar el producto: ' + error.message });
    }
  };

  const handleSolicitarAlternarEstado = (id) => {
    const encontrado = productos.find((pr) => (pr.p_id || pr.id) === id);
    if (encontrado) setProductoAAlternar(encontrado);
  };

  const handleConfirmarAlternarEstado = async () => {
    if (!productoAAlternar) return;
    const id = productoAAlternar.p_id || productoAAlternar.id;
    const estadoActual = productoAAlternar.p_activo ?? productoAAlternar.activo ?? true;
    const nuevoEstado = !estadoActual;

    try {
      const productoActualizado = await alternarEstadoProducto(id);

      setProductos((prev) =>
        prev.map((item) => {
          const itemId = item.p_id || item.id;
          if (itemId === id) {
            return {
              ...item,
              ...productoActualizado,
              p_activo: productoActualizado.p_activo ?? nuevoEstado
            };
          }
          return item;
        })
      );

      setProductoAAlternar(null);
      mostrarNotificacion(
        `¡Producto ${nuevoEstado ? 'activado' : 'desactivado'} con éxito!`,
        'success'
      );
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      setProductoAAlternar(null);
      mostrarNotificacion('Error al cambiar el estado: ' + error.message, 'danger');
    }
  };

  const estaActivoModal = productoAAlternar 
    ? (productoAAlternar.p_activo ?? productoAAlternar.activo ?? true)
    : true;

  return (
    <div className="container-fluid py-3">
      {/* Cartel de Alerta (Éxito / Error) */}
      {alerta && (
        <div 
          className={`alert alert-${alerta.tipo} alert-dismissible fade show d-flex align-items-center justify-content-between mb-4 shadow-sm rounded-3`} 
          role="alert"
        >
          <div>
            <strong>{alerta.tipo === 'success' ? '✓ ' : '⚠️ '}</strong> {alerta.texto}
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlerta(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Encabezado */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--titulos, #3E100F)' }}>Gestión de Productos</h2>
          <p className="text-muted small mb-0">Administrá y gestioná el estado de los productos.</p>
        </div>
        <button 
          onClick={handleAbrirCrear}
          className="btn text-white fw-semibold px-3 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2"
          style={{ backgroundColor: 'var(--titulos, #3E100F)' }}
        >
          <span>+</span> Nuevo Producto
        </button>
      </div>

      {/* Layout con Barra Lateral de Filtros + Grilla */}
      <div className="row g-3">
        <aside className="col-lg-3 d-flex flex-column gap-1">
          <label htmlFor="busqueda-privada" className="rotulo-filtro mb-2">
            Buscar
          </label>
          <input
            id="busqueda-privada"
            type="search"
            className="form-control input-busqueda campo-busqueda-tag mb-2"
            placeholder="Marca, tipo, varietal o bodega..."
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
              className="boton-error mt-2"
              onClick={filtros.limpiarFiltros}
            >
              Limpiar filtros
            </Boton>
          )}
        </aside>

        <section className="col-lg-9">
          <p className="small text-body-secondary">
            Mostrando {filtros.productosFiltrados.length} de {productosOpciones.length} productos
          </p>

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="text-muted small mt-2">Cargando gestión...</p>
            </div>
          ) : (
            <div className="row g-4">
              {filtros.productosFiltrados.map((producto) => (
                <div key={producto.p_id || producto.id} className="col-12 col-md-6 col-lg-4">
                  <ProductoCard
                    producto={producto}
                    esGestion={true}
                    onEditar={handleAbrirEditar}
                    onEliminar={handleSolicitarAlternarEstado}
                  />
                </div>
              ))}
              {filtros.productosFiltrados.length === 0 && (
                <div className="col-12 text-center py-5 text-muted">
                  No se encontraron productos con los filtros aplicados.
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* MODAL CREACIÓN / EDICIÓN */}
      {mostrarModalForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#64141B' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {productoEditando ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalForm(false)}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="modal-body p-4">
                  {errorModal && (
                    <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3" role="alert">
                      <div className="small">
                        <strong>⚠️ </strong> {errorModal.texto}
                      </div>
                      {errorModal.productoInactivo && (
                        <button
                          type="button"
                          className="btn btn-sm btn-warning fw-semibold text-nowrap"
                          onClick={handleReactivarDesdeModal}
                        >
                          Reactivar producto existente
                        </button>
                      )}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Marca *</label>
                      <input
                        type="text"
                        name="marca"
                        required
                        className="form-control"
                        value={formData.marca}
                        onChange={handleChangeForm}
                        placeholder="Ej: Rutini"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Tipo *</label>
                      <input
                        type="text"
                        name="tipo"
                        required
                        className="form-control"
                        value={formData.tipo}
                        onChange={handleChangeForm}
                        placeholder="Ej: Tinto"
                      />
                    </div>    

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Bodega *</label>
                      <input
                        type="text"
                        name="bodega"
                        required
                        className="form-control"
                        value={formData.bodega}
                        onChange={handleChangeForm}
                        placeholder="Ej: Rutini Wines"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Varietal</label>
                      <input
                        type="text"
                        name="varietal"
                        className="form-control"
                        value={formData.varietal}
                        onChange={handleChangeForm}
                        placeholder="Ej: Malbec (Opcional)"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Precio *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precio"
                        required
                        className="form-control"
                        value={formData.precio}
                        onChange={handleChangeForm}
                        placeholder="15000"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Costo</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="costo"
                        className="form-control"
                        value={formData.costo}
                        onChange={handleChangeForm}
                        placeholder="10000"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        required
                        className="form-control"
                        value={formData.stock}
                        onChange={handleChangeForm}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Año</label>
                      <input
                        type="number"
                        name="anio"
                        min="1800"
                        max={new Date().getFullYear()}
                        className="form-control"
                        value={formData.anio}
                        onChange={handleChangeForm}
                        placeholder="2021"
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-bold">Medida *</label>
                      <input
                        type="text"
                        name="medida"
                        required
                        className="form-control"
                        value={formData.medida}
                        onChange={handleChangeForm}
                        placeholder="Ej: 750 ml"
                      />          
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Ruta de Imagen (`/public`)</label>
                      <input
                        type="text"
                        name="img"
                        className="form-control"
                        value={formData.img}
                        onChange={handleChangeForm}
                        placeholder="/img/imagenesProductos/producto.png"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Descripción</label>
                      <textarea
                        name="descripcion"
                        rows="3"
                        className="form-control"
                        value={formData.descripcion}
                        onChange={handleChangeForm}
                        placeholder="Notas de cata, maridaje o detalles del producto..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => setMostrarModalForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-sm text-white px-4 fw-semibold" style={{ backgroundColor: '#B5865A' }}>
                    {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DINÁMICO: ALTERAR ESTADO (ACTIVAR / DESACTIVAR) */}
      {productoAAlternar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: 'var(--titulos, #3E100F)' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {estaActivoModal ? 'Confirmar Desactivación' : 'Confirmar Activación'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setProductoAAlternar(null)}></button>
              </div>

              <div className="modal-body p-4 text-center">
                <p className="mb-2 fs-6">
                  ¿Estás seguro de que deseas {estaActivoModal ? 'desactivar' : 'activar'} el producto?
                </p>
                <div className="p-3 rounded-2 fw-bold text-start mb-3" style={{ backgroundColor: '#F8F9FA', color: '#3E100F', borderLeft: '4px solid #B5865A' }}>
                  {productoAAlternar.p_marca || productoAAlternar.marca} {productoAAlternar.p_tipo ? `- ${productoAAlternar.p_tipo}` : ''}
                </div>
                <small className="text-muted">
                  {estaActivoModal 
                    ? 'El producto dejará de estar visible en el catálogo público.' 
                    : 'El producto volverá a mostrarse en el catálogo público.'}
                </small>
              </div>

              <div className="modal-footer border-0 bg-light justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => setProductoAAlternar(null)}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm text-white px-4 fw-semibold"
                  style={{ backgroundColor: 'var(--titulos, #3E100F)' }}
                  onClick={handleConfirmarAlternarEstado}
                >
                  {estaActivoModal ? 'Sí, Desactivar' : 'Sí, Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosPagePrivada;