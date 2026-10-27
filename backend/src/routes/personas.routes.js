import { Router } from 'express';
import * as controller from '../controllers/personas.controller.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

const router = Router ();

//RUTAS PROTEGIDAS
router.get('/clientes', verificarToken,verificarRol(['gerente', 'vendedor']), controller.listarClientes);
router.post('/clientes', verificarToken,verificarRol(['gerente', 'vendedor']), controller.crearCliente);

router.get('/empleados', verificarToken,verificarRol(['gerente']), controller.listarEmpleados);
router.post('/empleados', verificarToken,verificarRol(['gerente']), controller.crearEmpleado);


router.get('/:id', verificarToken,verificarRol(['gerente', 'vendedor']), controller.detallePersona);
router.put('/:id', verificarToken,verificarRol(['gerente']), controller.actualizarPersona);
router.patch('/:id', verificarToken,verificarRol(['gerente']), controller.cambiarEstado);

export default router;
