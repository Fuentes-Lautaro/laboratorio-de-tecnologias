const CORREO_DESTINO = 'maria.balbina.local@gmail.com';
const URL_API_EMAIL = `https://formsubmit.co/ajax/${CORREO_DESTINO}`;

const ETIQUETAS_ASUNTO = {
  consulta: 'Consulta general',
  subs: 'Subscripciones',
  envios: 'Envíos a domicilio',
};

export async function enviarConsulta(valores) {
  const asuntoLegible = ETIQUETAS_ASUNTO[valores.asunto] || valores.asunto;

  const cuerpoCorreo = {
    _subject: `Nueva consulta web: ${asuntoLegible} - ${valores.nombre}`,
    _template: 'table',
    Nombre: valores.nombre.trim(),
    Email: valores.email.trim(),
    Asunto: asuntoLegible,
    'Descripción de la consulta': valores.mensaje.trim(),
  };

  try {
    const respuesta = await fetch(URL_API_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(cuerpoCorreo),
    });

    if (respuesta.ok) {
      return await respuesta.json();
    }
    
    throw new Error('No se pudo enviar el correo.');
  } catch (error) {
    console.error('Error en el servicio de contacto:', error);
    throw new Error('Hubo un problema de conexión con el servidor de correo.');
  }
}