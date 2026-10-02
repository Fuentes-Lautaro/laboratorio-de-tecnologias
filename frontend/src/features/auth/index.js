// Exportación de tarjetas y componentes visuales
export { CardIngresoEmail } from './components/CardIngresoEmail';
export { CardIngresoContrasenia } from './components/CardIngresoContrasenia';
export { CardRegistro } from './components/CardRegistro';
export { default as FormularioLogin } from './components/FormularioLogin';
export { default as LoginGestionPage } from './pages/LoginGestionPage';
export { default as LoginPage } from './pages/LoginPage.jsx'

export {
  verificarEmailExistente,
  iniciarSesion,
  obtenerSesion,
  redirigirSiHaySesion,
  cerrarSesion,
  protegerRuta,
  redirigirSiHaySesionPrivado
} from './services/authService.js';