import { Router } from 'express';
import * as controller from '../controllers/eventos.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();
// RUTAS PÚBLICAS
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

// RUTAS PROTEGIDAS 
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.modificar);
router.delete('/:id', verificarToken, controller.eliminar);

export default router;