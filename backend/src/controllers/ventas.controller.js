import { pool } from '../config/db.js';

// LISTAR TODAS LAS VENTAS
export const listar = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                v.v_codigo AS codigo,
                v.v_fecha AS fecha,
                v.v_total AS monto,
                v.v_metodo_pago AS "metodoPago",
                v.evento_id AS "eventoId",
                p_cli.pe_dni AS "clienteDni",
                p_cli.pe_nombre AS "clienteNombre",
                p_emp.pe_dni AS "empleadoDni",
                p_emp.pe_nombre AS "empleadoNombre"
            FROM ventas v
            LEFT JOIN personas p_cli ON v.cliente_id = p_cli.pe_id
            LEFT JOIN personas p_emp ON v.personal_id = p_emp.pe_id
            ORDER BY v.v_fecha DESC;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// DETALLE DE UNA VENTA ESPECÍFICA 
export const detalle = async (req, res, next) => {
    try {
        const { id } = req.params; 

        const queryVenta = `
            SELECT 
                v.v_codigo AS codigo,
                v.v_fecha AS fecha,
                v.v_total AS monto,
                v.v_metodo_pago AS "metodoPago",
                v.evento_id AS "eventoId",
                p_cli.pe_dni AS "clienteDni",
                p_cli.pe_nombre AS "clienteNombre",
                p_emp.pe_dni AS "empleadoDni",
                p_emp.pe_nombre AS "empleadoNombre"
            FROM ventas v
            LEFT JOIN personas p_cli ON v.cliente_id = p_cli.pe_id
            LEFT JOIN personas p_emp ON v.personal_id = p_emp.pe_id
            WHERE v.v_codigo = $1;
        `;
        const resVenta = await pool.query(queryVenta, [id]);

        if (resVenta.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        // Consulta de los renglones asociados
        const queryRenglones = `
            SELECT 
                rv.iv_id AS id,
                rv.venta_codigo AS "ventaCodigo",
                rv.producto_codigo AS "productoCodigo",
                p.p_marca || ' ' || COALESCE(p.p_varietal, '') AS nombre,
                rv.iv_cantidad AS cantidad,
                rv.iv_precio_unidad AS "precioUnitario",
                (rv.iv_cantidad * rv.iv_precio_unidad) AS subtotal
            FROM reglones_venta rv
            JOIN productos p ON rv.producto_codigo = p.p_id
            WHERE rv.venta_codigo = $1;
        `;
        const resRenglones = await pool.query(queryRenglones, [id]);

        const venta = {
            ...resVenta.rows[0],
            items: resRenglones.rows
        };

        res.json(venta);
    } catch (err) {
        next(err);
    }
};

//CREAR UNA NUEVA VENTA 
export const crear = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { codigo, fecha, clienteDni, empleadoDni, eventoId, monto, metodoPago, items } = req.body;

        await client.query('BEGIN'); // Iniciar transacción

        // A. Buscar ID del cliente por su DNI (si fue provisto)
        let clienteId = null;
        if (clienteDni) {
            const resCli = await client.query(
                `SELECT pe_id FROM personas 
                 WHERE pe_dni = $1`,
                [clienteDni]
            );
            if (resCli.rows.length > 0) {
                clienteId = resCli.rows[0].pe_id;
            }
        }

        // B. Buscar ID del empleado por su DNI (si fue provisto)
        let personalId = null;
        if (empleadoDni) {
            const resPers = await client.query(
                `SELECT pe_id FROM personas  
                 WHERE pe_dni = $1`,
                [empleadoDni]
            );
            if (resPers.rows.length > 0) {
                personalId = resPers.rows[0].pe_id;
            }
        }

        // C. Generar un código si no se envió desde el frontend
        const codigoVenta = codigo || `VTA-${Date.now().toString().slice(-6)}`;
        const fechaVenta = fecha || new Date();

        // D. Insertar la cabecera en la tabla 'venta'
        const insertVentaQuery = `
            INSERT INTO ventas (v_codigo, v_fecha, cliente_id, personal_id, evento_id, v_total, v_metodo_pago)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const { rows: ventaCreada } = await client.query(insertVentaQuery, [
            codigoVenta,
            fechaVenta,
            clienteId,
            personalId,
            eventoId || null,
            monto,
            metodoPago
        ]);

        // E. Insertar cada ítem en la tabla 'reglones_venta' y actualizar el stock del producto
        if (items && Array.isArray(items) && items.length > 0) {
            for (const item of items) {
                const prodCodigo = item.productoCodigo || item.p_id;
                const cant = item.cantidad;
                const precioU = item.precioUnitario || item.precioU;

                // Insertar renglón
                await client.query(
                    `INSERT INTO reglones_venta (venta_codigo, producto_codigo, iv_cantidad, iv_precio_unidad)
                     VALUES ($1, $2, $3, $4)`,
                    [codigoVenta, prodCodigo, cant, precioU]
                );

                // Descontar del stock de productos
                await client.query(
                    `UPDATE productos 
                     SET p_stock = p_stock - $1 
                     WHERE p_id = $2 AND p_stock >= $1`,
                    [cant, prodCodigo]
                );
            }
        }

        await client.query('COMMIT'); // Confirmar transacción

        res.status(201).json({
            mensaje: 'Venta registrada con éxito',
            venta: ventaCreada[0]
        });
    } catch (err) {
        await client.query('ROLLBACK'); // Cancelar cambios si ocurre un error
        next(err);
    } finally {
        client.release();
    }
};

// MODIFICAR METODO DE PAGO O TOTAL DE UNA VENTA
export const modificar = async (req, res, next) => {
    try {
        const { id } = req.params; // v_codigo
        const { monto, metodoPago } = req.body;

        const { rows } = await pool.query(
            `UPDATE ventas 
             SET v_total = COALESCE($1, v_total), 
                 v_metodo_pago = COALESCE($2, v_metodo_pago) 
             WHERE v_codigo = $3 
             RETURNING *`,
            [monto, metodoPago, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Venta no encontrada para modificar' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// 5. ELIMINAR VENTA
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params; // v_codigo

        const { rows } = await pool.query(
            'DELETE FROM ventas WHERE v_codigo = $1 RETURNING *',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Venta no encontrada para eliminar' });
        }

        res.json({ mensaje: 'Venta y sus renglones eliminados correctamente', venta: rows[0] });
    } catch (err) {
        next(err);
    }
};