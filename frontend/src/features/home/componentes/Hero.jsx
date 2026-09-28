import { useEffect, useRef, useState } from 'react'
import Carousel from 'bootstrap/js/dist/carousel'
import '../../../styles/variables.css'


// Rutas de imágenes locales para las diapositivas
import hero1 from '../../../assets/local.jpg'
import hero2 from '../../../assets/suscripciones.png'
import hero3 from '../../../assets/eventos.png'

// Listado de diapositivas
const IMAGENES_HERO = [
  { id: 1, src: hero1, alt: 'Local presentación' },
  { id: 2, src: hero2, alt: 'Eventos presentacion' },
  { id: 3, src: hero3, alt: 'Suscripciones presentación' },
]

function Hero() {
  const carruselRef = useRef(null)
  // Estado para saber qué diapositiva está visible y cambiar la forma del indicador
  const [diapositivaActiva, setDiapositivaActiva] = useState(0)

  useEffect(() => {
    const elementoCarrusel = carruselRef.current
    if (!elementoCarrusel) return

    // Instancia del carrusel de Bootstrap
    const carrusel = Carousel.getOrCreateInstance(elementoCarrusel, {
      interval: 3500, // Tiempo de espera por slide (3.5 segundos)
      ride: 'carousel',
      pause: false    // Mantiene la reproducción aunque el usuario pase el cursor
    })

    // Arrancamos el temporizador
    carrusel.cycle()

    // Escuchamos el evento apenas INICIA la transición para mover la píldora al instante
    const alIniciarCambio = (evento) => {
      setDiapositivaActiva(evento.to)
    }

    elementoCarrusel.addEventListener('slide.bs.carousel', alIniciarCambio)

    // Limpieza al desmontar el componente para evitar duplicar eventos o fugas de memoria
    return () => {
      elementoCarrusel.removeEventListener('slide.bs.carousel', alIniciarCambio)
      carrusel.dispose()
    }
  }, [])

  return (
    <section 
      className="position-relative overflow-hidden"
      style={{ 
        // Estiramos la sección al 100% de la pantalla cancelando paddings del Layout principal
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-1.5rem' // Cancela el espacio blanco superior del main
      }}
    >
      <div 
        id="carruselHero" 
        ref={carruselRef} 
        className="carousel slide carousel-fade w-100"
      >
        
        {/* Contenedor de los indicadores (píldoras y círculos) */}
        <div className="carousel-indicators z-3 mb-3 align-items-center">
          {IMAGENES_HERO.map((imagen, indice) => {
            const esActivo = diapositivaActiva === indice

            return (
              <button
                key={imagen.id}
                type="button"
                data-bs-target="#carruselHero"
                data-bs-slide-to={indice}
                className={esActivo ? 'active' : ''}
                aria-current={esActivo ? 'true' : undefined}
                aria-label={`Diapositiva ${indice + 1}`}
                style={{
                  // Si está activa es una píldora de 35px; si no, un círculo de 10px
                  width: esActivo ? '35px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: esActivo ? 'var(--titulos)' : '#21140E',
                  opacity: esActivo ? 1 : 0.8,
                  border: 'none',
                  margin: '0 4px',
                  transition: 'all 0.2s ease-out',
                  padding: 0
                }}
              ></button>
            )
          })}
        </div>

        {/* Imágenes principales del carrusel */}
        <div className="carousel-inner w-100">
          {IMAGENES_HERO.map((imagen, indice) => (
            <div 
              key={imagen.id} 
              className={`carousel-item w-100 ${indice === 0 ? 'active' : ''}`}
            >
              <img 
                src={imagen.src} 
                className="d-block w-100" 
                style={{ 
                  width: '100%',
                  height: '60vh',       // Ocupa el 60% de la altura de la pantalla
                  minHeight: '300px',   // Altura mínima para que no quede aplastado en celulares pequeños
                  objectFit: 'cover',   // Mantiene la imagen bien encuadrada sin estirarse
                  objectPosition: 'center'
                }} 
                alt={imagen.alt} 
              />
            </div>
          ))}
        </div>

        {/* Flecha izquierda (Anterior) */}
        <button
          className="carousel-control-prev justify-content-start w-auto ps-0 z-3"
          type="button"
          data-bs-target="#carruselHero"
          data-bs-slide="prev"
        >
          {/* En celular padding px-2 py-3; en PC crece a px-md-3 py-md-4 */}
          <span 
            className="d-flex align-items-center justify-content-center px-2 py-3 px-md-3 py-md-4" 
            style={{ backgroundColor: 'var(--marca)' }}
            aria-hidden="true"
          >
            <span className="carousel-control-prev-icon" style={{ width: '1.2rem', height: '1.2rem' }}></span>
          </span>
          <span className="visually-hidden">Anterior</span>
        </button>

        {/* Flecha derecha (Siguiente) */}
        <button
          className="carousel-control-next justify-content-end w-auto pe-0 z-3"
          type="button"
          data-bs-target="#carruselHero"
          data-bs-slide="next"
        >
          {/* En celular padding px-2 py-3; en PC crece a px-md-3 py-md-4 */}
          <span 
            className="d-flex align-items-center justify-content-center px-2 py-3 px-md-3 py-md-4" 
            style={{ backgroundColor: 'var(--marca)' }}
            aria-hidden="true"
          >
            <span className="carousel-control-next-icon" style={{ width: '1.2rem', height: '1.2rem' }}></span>
          </span>
          <span className="visually-hidden">Siguiente</span>
        </button>

      </div>
    </section>
  )
}

export default Hero