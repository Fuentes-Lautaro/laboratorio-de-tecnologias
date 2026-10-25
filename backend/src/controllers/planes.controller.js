import { pool } from '../config/db.js'

export const listar = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM planes p ORDER BY ps_cantidad_vinos');
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

export const crear = async (req, res, next) => {
    try {
        const { nombre, descripcion, cantidadVinos, valor } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO planes (ps_nombre, ps_descripcion, ps_cantidad_vinos, ps_valor)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [ nombre, descripcion, cantidadVinos, valor ]
        );
        res.status(201).json(rows[0]);
    } catch(err) {
        next(err);
    }
}

export const modificar = async (req, res, next) => {
    try {
        const { nombre, descripcion, cantidadVinos, valor } = req.body;
        const { rows } = await pool.query(
            `UPDATE planes
            SET ps_nombre=$1, ps_descripcion=$2, ps_cantidad_vinos=$3, ps_valor=$4
            WHERE ps_id = $5
            RETURNING *`,
            [ nombre, descripcion, cantidadVinos, valor, req.params.id ]
        );
        res.json(rows[0]);
    } catch(err) {
        next(err);
    }
}

export const alternar = async (req, res, next) => {
    try{
        const id = req.params.id;
        const { rows } = await pool.query(
            `UPDATE planes
            SET ps_activo = NOT ps_activo
            WHERE ps_id = $1
            RETURNING *`,
            [id]
        );
        
        if (rows.length === 0){
            res.status(404).json({ error: "Plan no encontrado" });
        }

        res.json(rows[0]);
    } catch(err){
        next(err);
    }
}

export const eliminar = async (req, res, next) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM planes WHERE ps_id = $1', [req.params.id]);

        if (rowCount === 0){
            res.status(404).json({ error: "Plan no encontrado" });
        }

        res.status(204).end();
    } catch(err){
        next(err);
    }
}