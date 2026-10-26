import { Router } from 'express';
import * as controller from '../controllers/ventas.controller.js';
import * as renglonesController from '../controllers/renglones_venta.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();


//renglones de venta publico
router.get('/renglones', renglonesController.listar);
router.get('/renglones/:id', renglonesController.detalle);

//renglones de venta privado
router.post('/renglones', verificarToken, renglonesController.crear);
router.put('/renglones/:id', verificarToken, renglonesController.modificar);
router.delete('/renglones/:id', verificarToken, renglonesController.eliminar);

// RUTAS PUBLICAS
router.get('/', controller.listar);
router.get('/:id', controller.detalle);

// RUTAS PROTEGIDAS
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.modificar);
router.delete('/:id', verificarToken, controller.eliminar);



export default router;