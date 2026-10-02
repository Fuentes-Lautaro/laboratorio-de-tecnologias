const BASE_URL = '/backend/data';

export async function getEventos(){
  const res = await fetch(`${BASE_URL}/eventos.json`);
  if (!res.ok) throw new Error('Error al cargar la lista de eventos');
  return await res.json();
};
