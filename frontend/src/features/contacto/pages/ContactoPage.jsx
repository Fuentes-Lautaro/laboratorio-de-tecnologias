import FormularioContacto from '../components/FormularioContacto'
import Tarjeta from '../../../shared/components/Tarjeta'

const DATOS_CONTACTO = [
  { id: 1, titulo: 'Dirección', texto: 'San Luis, Argentina' },
  { id: 2, titulo: 'Horario', texto: 'Lunes a sabado de 9 a 20 hs' },
  { id: 3, titulo: 'Email', texto: 'mariabalbina@gmail.com' },
]

function ContactoPage() {
  return (
    <div className="row g-4 g-lg-5">
      <div className="col-lg-5">
        <h1 className="h2 titulo-tag">Contacto</h1>
        <p className="text-body-secondary mb-4">
          ¿Tenés alguna duda? Escribinos y te respondemos en menos de 24 horas.
        </p>
        <ul className="list-unstyled lista-contacto-tag">
          {DATOS_CONTACTO.map((dato) => (
            <li key={dato.id}>
              <strong className="d-block">{dato.titulo}</strong>
              <span className="text-body-secondary">{dato.texto}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-lg-7">
        <Tarjeta titulo="Envianos tu consulta" className="tarjeta-tag">
          <FormularioContacto />
        </Tarjeta>
      </div>
    </div>
  )
}

export default ContactoPage