import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

//RUTAS PUBLICAS
router.post('/registro', controller.registro);
router.post('/login', controller.login);
router.post('/verificar-mail', controller.verificar);
router.get('/todos', controller.listar);

//RUTAS PROTEGIDAS
//router.get('/perfil', verificarToken, controller.perfil);

export default router;