const BASE_URL = '/backend/data'; // Ajustá la URL según tu backend

export async function getEventos(){
  // GET: Obtener / Ver todos los eventos  
        const res = await fetch(`${BASE_URL}/eventos.json`);
        if (!res.ok) throw new Error('Error al cargar la lista de eventos');
        return await res.json();
 };