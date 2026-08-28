//trae botones del carrusel
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

//trae slides e indicadores del carrusel
const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelectorAll(".indicador");

let indiceActual = 0;

const cambiarSlide = (nuevoIndice) => {
    slides[indiceActual].classList.remove("activo");
    indicadores[indiceActual].classList.remove("activo");

    indiceActual = nuevoIndice;

    slides[indiceActual].classList.add("activo");
    indicadores[indiceActual].classList.add("activo");
};

// Eventos de los botones[cite: 1]
btnNext.addEventListener("click", () => {
    let siguiente = (indiceActual + 1) % slides.length;
    cambiarSlide(siguiente);
});

btnPrev.addEventListener("click", () => {
    let anterior = (indiceActual - 1 + slides.length) % slides.length;
    cambiarSlide(anterior);
});

// Eventos de los indicadores[cite: 1]
indicadores.forEach((indicador, index) => {
    indicador.addEventListener("click", () => {
        cambiarSlide(index);
    });
});