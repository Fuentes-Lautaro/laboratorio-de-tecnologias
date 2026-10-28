import { Router } from 'express';
import * as controller from '../controllers/productos.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router()

//RUTAS PUBLICAS
router.get('/', controller.listar);
router.get('/:id', controller.detalle);

//RUTAS PROTEGIDAS
router.post('/', verificarToken, verificarRol(['vendedor','gerente']), controller.crear);
router.put('/:id', verificarToken, verificarRol(['vendedor', 'gerente']), controller.modificar);
router.patch('/:id', verificarToken, verificarRol(['gerente']), controller.alternar);

export default router;