

function NostrosPages() {
    return (
        <div className="nosotros-main">

                <section className="nosotros-hero">
                    <span className="subtitulo-seccion">NUESTRA HISTORIA</span>
                    <h1>Pasión por el bienestar y el vino de autor</h1>
                    <p>Un negocio familiar nacido con el compromiso de crear experiencias auténticas y memorables.</p>
                </section>

                <section className="nosotros-contenedor">

                    <article className="nosotros-bloque">
                        <div className="nosotros-imagen">
                            <img src="/imgNosotros/maria-historia.jpg" alt="Historia de María"/>
                        </div>

                        <div className="nosotros-texto">
                            <span className="bloque-tag">ORIGEN & MEMORIA</span>
                            <h2>El viaje de María</h2>
                            <p>
                                Escapando del horror de la guerra civil, María subió a un barco en España con una pequeña valija y la incertidumbre de cruzar el océano entero. Tras atracar en Buenos Aires, cruzó la inmensa pampa en tren hasta asentarse en un apacible pueblo rural de San Rafael.
                            </p>
                            <p>
                                Allí aprendió a regar por acequias, a podar viñedos bajo el sol cuyano y a mezclar su acento natal con las costumbres de su nuevo hogar. Con los años, el murmullo de los álamos y la paz de la montaña borraron el eco de los cañones, devolviéndole la vida que la guerra le había quitado.
                            </p>
                        </div>
                    </article>

                    <article className="nosotros-bloque bloque-invertido">
                        <div className="nosotros-imagen">
                            <img src="/imgNosotros/balbina-historia.jpg" alt="Historia de Balbina"/>
                        </div>

                        <div className="nosotros-texto">
                            <span className="bloque-tag">RAÍCES & PORVENIR</span>
                            <h2>El camino de Balbina</h2>
                            <p>
                                Huyendo de la posguerra y el hambre en España, Balbina subió a un buque cargado de ilusiones con destino al Río de la Plata. Al desembarcar en el puerto de Buenos Aires, el bullicio de los tranvías y la inmensidad de la ciudad la recibieron como un mundo completamente nuevo.
                            </p>
                            <p>
                                Se instaló en un conventillo porteño, donde entre costuras, platos compartidos y mates aprendió a caminar las calles adoquinadas. Con el tiempo, la capital se convirtió en su verdadero hogar, transformando la nostalgia del desarraigo en un futuro lleno de trabajo, familia y libertad.
                            </p>
                        </div>

                    </article>

                    <article className="nosotros-bloque">
                        <div className="nosotros-imagen">
                            <img src="/img/logo-redondo.png" alt="El legado de María Balbina"/>
                        </div>

                        <div className="nosotros-texto">
                            <span className="bloque-tag">NUESTRO LEGADO</span>
                            <h2>Dos generaciones después</h2>
                            <p>
                                Hoy, dos generaciones más tarde, nace <strong>María Balbina</strong> con el profundo propósito de honrar las vidas, el coraje y la resiliencia de aquellas dos mujeres que cruzaron un océano buscando un porvenir.
                            </p>
                            <p>
                                Cada una de nuestras botellas es un tributo a su historia de esfuerzo y esperanza: vinos pensados para celebrar el encuentro, la sobremesa y los lazos que trascienden el tiempo.
                            </p>
                            <a href="./suscripciones.html" className="btn-nosotros">Conocé nuestras suscripciones</a>
                        </div>

                </article>

            </section>
        </div>
    )
}

export default NostrosPages

