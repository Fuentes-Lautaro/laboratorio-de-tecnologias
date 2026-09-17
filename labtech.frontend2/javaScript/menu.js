// 1. SELECCIÓN DE ELEMENTOS POR CLASE
const btnAbrir = document.getElementById("btn-abrir-menu");
const btnCerrar = document.getElementById("btn-cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const overlay = document.getElementById("menu-overlay");


// 2. FUNCIONES DE MANIPULACIÓN DE CLASES
const abrirMenu = () => {
    menuLateral.classList.add("activo");
    console.log(menuLateral);
    console.log(menuLateral.classList);
    overlay.classList.add("activo");
};

const cerrarMenu = () => {
    menuLateral.classList.remove("activo");
    overlay.classList.remove("activo");
    console.log(menuLateral);
    console.log(menuLateral.classList);
};

// 3. REGISTRO DE EVENTOS (LISTENERS)
btnAbrir.addEventListener("click", abrirMenu);
btnCerrar.addEventListener("click", cerrarMenu);
overlay.addEventListener("click", cerrarMenu);