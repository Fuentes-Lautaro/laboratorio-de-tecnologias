const BASE_URL = 'http://localhost:3000/api';

export async function getEventos(){
  const res = await fetch(`${BASE_URL}/eventos`);
  if (!res.ok) throw new Error('Error al cargar la lista de eventos');
  return await res.json();
};
