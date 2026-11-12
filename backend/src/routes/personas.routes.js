import { Router } from 'express';
import * as controller from '../controllers/personas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router();

// RUTAS PROTEGIDAS UNIFICADAS (/api/personas)
router.get('/', verificarToken, verificarRol(['gerente', 'vendedor']), controller.listarPersonas);
router.get('/:id', verificarToken, verificarRol(['gerente', 'vendedor']), controller.detallePersona);

router.post('/', verificarToken, verificarRol(['gerente', 'vendedor']), controller.crearPersona);
router.put('/:id', verificarToken, verificarRol(['gerente', 'vendedor']), controller.actualizarPersona);
router.patch('/:id', verificarToken, verificarRol(['gerente', 'vendedor']), controller.cambiarEstado);

export default router;