import { Router } from 'express';
import * as controller from '../controllers/suscripciones.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// RUTAS PROTEGIDAS (Requieren Token JWT)
router.get('/', verificarToken, controller.listarPersonasConSuscripcion);
router.get('/:id', verificarToken, controller.obtener);
router.post('/', verificarToken, controller.crear);

export default router;