const URL_API_WEB3FORMS = 'https://api.web3forms.com/submit';
const TU_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const ETIQUETAS_ASUNTO = {
  consulta: 'Consulta general',
  subs: 'Subscripciones',
  envios: 'Envíos a domicilio',
};

export async function enviarConsulta(valores) {

  if (!TU_ACCESS_KEY) {
    throw new Error('Falta configurar la clave de Web3Forms en el archivo .env');
  }

  const asuntoLegible = ETIQUETAS_ASUNTO[valores.asunto] || valores.asunto;

  const datosFormulario = {
    access_key: TU_ACCESS_KEY,
    subject: `Nueva consulta web: ${asuntoLegible} - ${valores.nombre}`,
    from_name: 'Web María Balbina',
    replyto: valores.email.trim(),
    Nombre: valores.nombre.trim(),
    Email: valores.email.trim(),
    Asunto: asuntoLegible,
    Mensaje: valores.mensaje.trim(),
  };

  const respuesta = await fetch(URL_API_WEB3FORMS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(datosFormulario),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.message || 'No se pudo enviar la consulta. Intentá nuevamente.');
  }

  return resultado;
}