import { Router } from 'express';
import * as controller from '../controllers/ventas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// RUTAS PUBLICAS
router.get('/', controller.listar);
router.get('/:id', controller.detalle);

// RUTAS PROTEGIDAS
router.post('/', verificarToken, controller.crear);

//solo para probar
router.put('/:id', verificarToken, controller.modificar);
router.delete('/:id', verificarToken, controller.eliminar);



export default router;