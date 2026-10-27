import { Router } from 'express';
import * as controller from '../controllers/personas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router ();

//RUTAS PROTEGIDAS
router.get('/clientes', verificarToken, controller.listarClientes);
router.post('/clientes', verificarToken, controller.crearCliente);

router.get('/empleados', verificarToken, controller.listarEmpleados);
router.post('/empleados', verificarToken, controller.crearEmpleado);


router.get('/:id', verificarToken, controller.detallePersona);
router.put('/:id', verificarToken, controller.actualizarPersona);
router.patch('/:id', verificarToken, controller.cambiarEstado);

export default router;
