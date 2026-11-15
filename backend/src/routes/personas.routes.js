import { Router } from 'express';
import * as controller from '../controllers/personas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router();

// RUTAS PROTEGIDAS UNIFICADAS (/api/personas)
router.get('/', verificarToken, verificarRol(['gerente', 'vendedor']), controller.listarPersonas);
router.post('/', verificarToken, verificarRol(['gerente', 'vendedor']), controller.crearPersona);

router.get('/perfil', verificarToken, controller.detallePublicoPersona);
router.put('/actualizarme', verificarToken, controller.actualizarme);

// Búsqueda rápida por DNI para el módulo de Ventas
router.get('/dni/:dni', verificarToken, verificarRol(['gerente', 'vendedor']), controller.buscarPorDni);

router.put('/:id', verificarToken, verificarRol(['gerente', 'vendedor']), controller.actualizarPersona);
router.patch('/:id', verificarToken, verificarRol(['gerente', 'vendedor']), controller.cambiarEstado);
router.get('/:id', verificarToken, controller.detallePersona);

export default router;