import { Router } from 'express';
import * as controller from '../controllers/planes.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router();

//RUTAS PUBLICAS
router.get('/', controller.listar);

//RUTAS PROTEGIDAS
router.post('/', verificarToken,verificarRol(['gerente']), controller.crear);
router.put('/:id', verificarToken,verificarRol(['gerente']), controller.modificar);
router.patch('/:id', verificarToken, verificarRol(['gerente']), controller.alternar);
router.delete('/:id', verificarToken, verificarRol(['gerente']), controller.eliminar);

export default router;