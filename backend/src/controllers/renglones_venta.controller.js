import { pool } from '../config/db.js';

// 1. LISTAR TODOS LOS RENGLONES
export const listar = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                rv.iv_id AS id,
                rv.venta_codigo AS "ventaCodigo",
                rv.producto_codigo AS "productoCodigo",
                rv.iv_cantidad AS cantidad,
                rv.iv_precio_unidad AS "precioUnitario"
            FROM reglones_venta rv
            ORDER BY rv.iv_id ASC;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// 2. DETALLE DE UN RENGLON ESPECIFICO
export const detalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                rv.iv_id AS id,
                rv.venta_codigo AS "ventaCodigo",
                rv.producto_codigo AS "productoCodigo",
                rv.iv_cantidad AS cantidad,
                rv.iv_precio_unidad AS "precioUnitario"
            FROM reglones_venta rv
            WHERE rv.iv_id = $1;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Renglón de venta no encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// 3. CREAR UN RENGLON INDIVIDUAL
export const crear = async (req, res, next) => {
    try {
        const { ventaCodigo, productoCodigo, cantidad, precioUnitario } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO reglones_venta (venta_codigo, producto_codigo, iv_cantidad, iv_precio_unidad)
             VALUES ($1, $2, $3, $4)
             RETURNING iv_id AS id, venta_codigo AS "ventaCodigo", producto_codigo AS "productoCodigo", iv_cantidad AS cantidad, iv_precio_unidad AS "precioUnitario"`,
            [ventaCodigo, productoCodigo, cantidad, precioUnitario]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// 4. MODIFICAR CANTIDAD O PRECIO DE UN RENGLON
export const modificar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cantidad, precioUnitario } = req.body;

        const { rows } = await pool.query(
            `UPDATE reglones_venta 
             SET iv_cantidad = COALESCE($1, iv_cantidad),
                 iv_precio_unidad = COALESCE($2, iv_precio_unidad)
             WHERE iv_id = $3
             RETURNING iv_id AS id, venta_codigo AS "ventaCodigo", producto_codigo AS "productoCodigo", iv_cantidad AS cantidad, iv_precio_unidad AS "precioUnitario"`,
            [cantidad, precioUnitario, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Renglón no encontrado para modificar' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// 5. ELIMINAR RENGLON
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            'DELETE FROM reglones_venta WHERE iv_id = $1 RETURNING *',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Renglón no encontrado para eliminar' });
        }

        res.json({ mensaje: 'Renglón eliminado correctamente', renglon: rows[0] });
    } catch (err) {
        next(err);
    }
};