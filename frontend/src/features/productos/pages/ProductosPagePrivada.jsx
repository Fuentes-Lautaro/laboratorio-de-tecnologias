import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import { getProductos } from '../services/productosServices';

const FORM_INICIAL = {
  id: '',
  marca: '',
  tipo: '',
  precio: '$',
  costo: '',
  anio: '',
  medida: '',
  bodega: '',
  varietal: '',
  stock: 0,
  img: '',
  descripcion: '',
};

export function ProductosPagePrivada() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para Modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado del Formulario
  const [formData, setFormData] = useState(FORM_INICIAL);

  useEffect(() => {
    cargarLista();
  }, []);

  const cargarLista = async () => {
    try {
      const data = await getProductos();
      setProductos(data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setCargando(false);
    }
  };

  // --- MANEJO DE CREAR Y EDITAR ---
  const handleAbrirCrear = () => {
    setProductoEditando(null);
    setFormData(FORM_INICIAL);
    setMostrarModalForm(true);
  };

  const handleAbrirEditar = (producto) => {
    setProductoEditando(producto);
    setFormData({
        id: producto.id || '',
        marca: producto.marca || '',
        tipo: producto.tipo || '',
        precio: producto.precio || '',
        costo: producto.costo || '',
        anio: producto.anio || '',
        medida: producto.medida || 0,
        bodega: producto.bodega || '',
        varietal: producto.varietal || '',
        stock: producto.stock || 0,
        img: producto.img || '',
        descripcion: producto.descripcion || '',
    });
    setMostrarModalForm(true);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (productoEditando) {
        // EDICIÓN
        const guardado = await actualizarProducto(productoEditando.id, formData);
        setProductos(productos.map((ev) => (ev.id === produtoEditando.id ? { ...ev, ...guardado } : ev)));
      } else {
        // CREACIÓN
        const nuevo = await crearProducto(formData);
        setProductos([...productos, nuevo]);
      }
      setMostrarModalForm(false);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  // --- MANEJO DE ELIMINAR ---
  const handleSolicitarEliminar = (id) => {
    const encontrado = productos.find((pr) => pr.id === id);
    if (encontrado) setProductoAEliminar(encontrado);
  };

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar.id);
      setProductos(productos.filter((ev) => ev.id !== productoAEliminar.id));
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* Encabezado con Botón Crear */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#3E100F' }}>Gestión de Productos</h2>
          <p className="text-muted small mb-0">Administrá los productos.</p>
        </div>
        <button 
          onClick={handleAbrirCrear}
          className="btn text-white fw-semibold px-3 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2"
          style={{ backgroundColor: 'var(--detalles, #B5865A)' }}
        >
          <span>➕</span> Nuevo Producto
        </button>
      </div>

      {/* Grilla de Productos */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="text-muted small mt-2">Cargando gestión...</p>
        </div>
      ) : (
        <div className="row g-4">
          {productos.map((producto) => (
            <div key={producto.id} className="col-12 col-md-6 col-lg-4">
              <ProductoCard
                producto={producto}
                esGestion={true}
                onEditar={handleAbrirEditar}
                onEliminar={handleSolicitarEliminar}
              />
            </div>
          ))}
          {productos.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              No hay productos registrados. Hacé clic en "Nuevo Producto" para agregar uno.
            </div>
          )}
        </div>
      )}

      {/* CREACIÓN / EDICIÓN */}
      {mostrarModalForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#1C1614' }}>
                <h5 className="modal-title fw-bold fs-6">
                  {productoEditando ? '✏️ Editar Producto' : '✨ Crear Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalForm(false)}></button>
              </div>

            <form onSubmit={handleSubmitForm}>
                <div className="modal-body p-4">
                    <div className="row g-3">

                        {/* Marca */}
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold">Marca</label>
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

                        {/* Tipo */}
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold">Tipo</label>
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

                        {/* Bodega */}
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold">Bodega</label>
                            <input
                                type="text"
                                name="bodega"
                                className="form-control"
                                value={formData.bodega}
                                onChange={handleChangeForm}
                                placeholder="Ej: Rutini Wines"
                            />
                        </div>

                        {/* Varietal */}
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold">Varietal</label>
                            <input
                                type="text"
                                name="varietal"
                                className="form-control"
                                value={formData.varietal}
                                onChange={handleChangeForm}
                                placeholder="Ej: Malbec"
                            />
                        </div>

                        {/* Precio */}
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold">Precio</label>
                            <input
                                type="text"
                                name="precio"
                                required
                                className="form-control"
                                value={formData.precio}
                                onChange={handleChangeForm}
                                placeholder="15000"
                            />
                        </div>

                        {/* Costo */}
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold">Costo</label>
                            <input
                                type="text"
                                name="costo"
                                className="form-control"
                                value={formData.costo}
                                onChange={handleChangeForm}
                                placeholder="10000"
                            />
                        </div>

                        {/* Stock */}
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold">Stock</label>
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

                        {/* Año */}
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold">Año</label>
                            <input
                                type="text"
                                name="anio"
                                className="form-control"
                                value={formData.anio}
                                onChange={handleChangeForm}
                                placeholder="2021"
                            />
                        </div>

                        {/* Medida */}
                        <div className="col-12 col-md-8">
                            <label className="form-label small fw-bold">Medida</label>
                            <input
                                type="text"
                                name="medida"
                                className="form-control"
                                value={formData.medida}
                                onChange={handleChangeForm}
                                placeholder="Ej: 750 ml"
                            />          
                        </div>

                        {/* Imagen / Ruta */}
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

                        {/* Descripción */}
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

     
      {productoAEliminar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-0 text-white" style={{ backgroundColor: '#1C1614' }}>
                <h5 className="modal-title fw-bold fs-6">🗑️ Confirmar Eliminación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setProductoAEliminar(null)}></button>
              </div>

              <div className="modal-body p-4 text-center">
                <p className="mb-2 fs-6">¿Estás seguro de que deseas eliminar el producto?</p>
                <div className="p-3 rounded-2 fw-bold text-start mb-3" style={{ backgroundColor: '#F8F9FA', color: '#3E100F', borderLeft: '4px solid #B5865A' }}>
                  {productoAEliminar.nombre}
                </div>
                <small className="text-muted">Esta acción no se puede deshacer.</small>
              </div>

              <div className="modal-footer border-0 bg-light justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => setProductoAEliminar(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-sm btn-danger px-3 fw-semibold" style={{ backgroundColor: '#A93226', borderColor: '#A93226' }} onClick={handleConfirmarEliminar}>
                  Sí, Eliminar
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