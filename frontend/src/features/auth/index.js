// Exportación de tarjetas y componentes visuales
export { CardIngresoEmail } from './componentes/CardIngresoEmail';
export { CardIngresoPassword } from './componentes/CardIngresoPassword';
export { CardRegistro } from './componentes/CardRegistro';
export { default as FormularioLogin } from './componentes/FormularioLogin';
export { default as LoginGestionPage } from './pages/LoginGestionPage';

// Exportación de servicios y utilidades de autenticación
export {
  verificarEmailExistente,
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  protegerRuta,
  redirigirSiHaySesion
} from './services/authService';