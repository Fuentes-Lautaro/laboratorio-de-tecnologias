import { Router } from 'express';
import * as controller from '../controllers/eventos.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router();
// RUTAS PÚBLICAS
router.get('/', controller.listar);
router.get('/:id', controller.obtener);


// RUTAS PROTEGIDAS
router.post('/', verificarToken,verificarRol(['cm']), controller.crear);
router.put('/:id', verificarToken,verificarRol(['cm']), controller.modificar);
router.delete('/:id', verificarToken,verificarRol(['cm']), controller.eliminar);


export default router;

