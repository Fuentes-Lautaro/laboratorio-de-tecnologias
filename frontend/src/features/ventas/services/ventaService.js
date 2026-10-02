const URL_BASE = '/backend/data'; // O la ruta donde tengas tus JSON locales

// Ejemplo de cómo arma el servicio las ventas con sus renglones
export async function getVentas() {
  const resVentas = await fetch(`${URL_BASE}/ventas.json`);
  const ventas = await resVentas.json();

  const resRenglones = await fetch(`${URL_BASE}/renglones_venta.json`);
  const renglones = await resRenglones.json();

  // Se cruzan los datos para que cada venta tenga su array de "items" (renglones)
  return ventas.map(v => ({
    ...v,
    items: renglones.filter(r => r.ventaCodigo === v.codigo)
  }));
}
export async function crearVenta(nuevaVenta) {
  // Simulación de guardado en memoria para entorno de desarrollo local con JSON
  return { ...nuevaVenta };
}