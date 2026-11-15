import { Router } from 'express';
import * as controller from '../controllers/suscripciones.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';


const router = Router();


// RUTAS PROTEGIDAS (Requieren Token JWT)
router.get('/listar', verificarToken, controller.listarSuscripciones);
router.get('/', verificarToken, controller.listarPersonasConSuscripcion);
router.post('/', verificarToken, controller.crear);
router.get('/:id', verificarToken, controller.obtener);

export default router;
