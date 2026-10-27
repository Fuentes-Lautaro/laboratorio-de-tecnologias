import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetalleProducto from '../components/DetalleProducto';
import { getProductoPorId } from '../services/productosServices';

export function DetalleProductoPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setCargando(true);
      getProductoPorId(id)
        .then((data) => {
          setProducto(data);
          setCargando(false);
        })
        .catch((err) => {
          setError(err.message || 'Error al cargar el producto');
          setCargando(false);
        });
    }
  }, [id]);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="text-muted small mt-2">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <DetalleProducto producto={producto} />
    </div>
  );
}

export default DetalleProductoPage;