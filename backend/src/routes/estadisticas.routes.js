import { Router } from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import * as controller from '../controllers/estadisticas.controller.js';

const router = Router();

router.get('/',verificarToken,verificarRol(['gerente', 'vendedor']), controller.obtenerResumenEstadisticas);

export default router;