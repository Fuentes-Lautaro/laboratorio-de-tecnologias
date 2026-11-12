import { pool } from '../config/db.js';

export const listar = async (req, res, next) => {
    try {
        const { todos } = req.query;

        if (todos === 'true') {
            const { rows } = await pool.query(`
                SELECT * FROM eventos
                ORDER BY
                    CASE
                        WHEN e_activo = true AND e_fecha >= CURRENT_DATE THEN 1
                        WHEN e_activo = true AND e_fecha < CURRENT_DATE THEN 2
                        WHEN e_activo = false AND e_fecha >= CURRENT_DATE THEN 3
                        ELSE 4
                    END ASC,
                    CASE WHEN e_fecha >= CURRENT_DATE THEN e_fecha END ASC,
                    CASE WHEN e_fecha < CURRENT_DATE THEN e_fecha END DESC
            `);
            return res.json(rows);
        }

        const { rows } = await pool.query(
            'SELECT * FROM eventos WHERE e_activo = true AND e_fecha >= CURRENT_DATE ORDER BY e_fecha ASC'
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

export const obtener = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM eventos WHERE e_id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const crear = async (req, res, next) => {
    try {
        const { nombre, fecha, descripcion, cant_asist, url_imagen } = req.body;

        if (!nombre || !fecha) {
            return res.status(400).json({ error: "El nombre y la fecha son obligatorios" });
        }

        const { rows } = await pool.query(
            `INSERT INTO eventos (e_nombre, e_fecha, e_descripcion, e_cant_asist, e_url_imagen)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nombre, fecha, descripcion, cant_asist, url_imagen]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const modificar = async (req, res, next) => {
    try {
        const { nombre, fecha, descripcion, cant_asist, url_imagen } = req.body;

        if (!nombre || !fecha) {
            return res.status(400).json({ error: "El nombre y la fecha son obligatorios" });
        }

        const { rows } = await pool.query(
            `UPDATE eventos
             SET e_nombre = $1, e_fecha = $2, e_descripcion = $3, e_cant_asist = $4, e_url_imagen = $5
             WHERE e_id = $6
             RETURNING *`,
            [nombre, fecha, descripcion, cant_asist, url_imagen, req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const alternar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'UPDATE eventos SET e_activo = NOT e_activo WHERE e_id = $1 RETURNING *',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};