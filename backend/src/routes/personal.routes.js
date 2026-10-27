import { Router } from 'express';
import * as controller from '../controllers/personal.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router ();

//RUTAS PROTEGIDAS
router.get('/', verificarToken, controller.listar);
router.get('/:id', verificarToken, controller.detalle);
router.put('/:id', verificarToken, controller.modificar);
router.delete('/:id', verificarToken, controller.eliminar);

export default router;