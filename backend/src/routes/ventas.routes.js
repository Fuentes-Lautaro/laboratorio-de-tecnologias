import { Router } from 'express';
import * as controller from '../controllers/ventas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router();

// RUTAS PUBLICAS
router.get('/', verificarToken,verificarRol(['gerente', 'vendedor']),controller.listar);
router.get('/:id', verificarToken,verificarRol(['gerente', 'vendedor']), controller.detalle);

// RUTAS PROTEGIDAS
router.post('/', verificarToken,verificarRol(['gerente', 'vendedor']), controller.crear);

//solo para probar
router.put('/:id', verificarToken,verificarRol(['gerente', 'vendedor']), controller.modificar);
router.delete('/:id', verificarToken,verificarRol(['gerente', 'vendedor']), controller.eliminar);


export default router;