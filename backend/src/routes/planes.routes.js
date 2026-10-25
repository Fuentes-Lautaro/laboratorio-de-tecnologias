import { Router } from 'express';
import * as controller from '../controllers/planes.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

//RUTAS PUBLICAS
router.get('/', controller.listar);

//RUTAS PROTEGIDAS
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.modificar);
router.patch('/:id', verificarToken, controller.alternar);
router.delete('/:id', verificarToken, controller.eliminar);

export default router;