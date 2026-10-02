// Exportación de tarjetas y componentes visuales
export { CardIngresoEmail } from './components/CardIngresoEmail';
export { CardIngresoPassword } from './components/CardIngresoPassword';
export { CardRegistro } from './components/CardRegistro';
export { default as FormularioLogin } from './components/FormularioLogin';
export { default as LoginGestionPage } from './pages/LoginGestionPage';

// Exportación de servicios y utilidades de autenticación
export {
  verificarEmailExistente,
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  protegerRuta,
  redirigirSiHaySesion
} from './services/authService.js';