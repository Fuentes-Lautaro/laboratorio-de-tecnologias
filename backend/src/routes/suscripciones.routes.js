import { Router } from 'express';
import * as controller from '../controllers/suscripciones.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// RUTA PÚBLICA (Webhook de Mercado Pago - no lleva JWT)
router.post('/webhook', controller.webhookMercadoPago);

// RUTAS DE PAGO CON MERCADO PAGO (Requieren Token JWT)
router.post('/preferencia', verificarToken, controller.crearPreferenciaMP);
router.post('/verificar-pago', verificarToken, controller.verificarPagoMP);

// RUTA DE CLIENTE LOGUEADO (Suscripciones propias)
router.get('/mis-suscripciones', verificarToken, controller.obtenerMisSuscripciones);

// RUTAS PROTEGIDAS EXISTENTES
router.get('/listar', verificarToken, controller.listarSuscripciones);
router.get('/', verificarToken, controller.listarPersonasConSuscripcion);
router.post('/', verificarToken, controller.crear);
router.get('/:id', verificarToken, controller.obtener);

export default router;