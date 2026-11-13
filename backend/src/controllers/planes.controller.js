import { pool } from '../config/db.js'

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

export const listar = async (req, res, next) => {
    try {
        // Calculamos el período del próximo mes en formato 'YYYY-MM' (ej: '2026-12')
        const hoy = new Date();
        const proximoMesDate = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
        const anio = proximoMesDate.getFullYear();
        const mes = String(proximoMesDate.getMonth() + 1).padStart(2, '0');
        const periodoProximoMes = `${anio}-${mes}`;

        console.log("PERIODO BUSCADO EN DB:", periodoProximoMes);

        const query = `
            SELECT 
                p.ps_id, 
                p.ps_nombre, 
                p.ps_descripcion, 
                p.ps_cantidad_vinos, 
                p.ps_valor, 
                p.ps_activo,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pr.p_id,
                            'marca', pr.p_marca,
                            'varietal', pr.p_varietal,
                            'medida', pr.p_medida,
                            'imagen_url', pr.p_imagen_url
                        )
                    ) FILTER (WHERE pr.p_id IS NOT NULL), 
                    '[]'
                ) AS productos_proximo_mes
            FROM planes p
            LEFT JOIN registrosMes rm ON p.ps_id = rm.ps_id AND rm.rm_periodo = $1
            LEFT JOIN productos pr ON rm.p_id = pr.p_id
            GROUP BY p.ps_id
            ORDER BY p.ps_cantidad_vinos;
        `;

        const { rows } = await pool.query(query, [periodoProximoMes]);
        console.log("PLANES CON PRODUCTOS:", JSON.stringify(rows, null, 2));
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Guardar o actualizar los vinos de un plan para un mes específico
export const guardarRegistroMes = async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { planId, periodo, productos } = req.body; 

        // Borramos los registros anteriores para ese plan y período (para pisarlos con los nuevos seleccionados)
        await client.query(
            `DELETE FROM registrosMes WHERE ps_id = $1 AND rm_periodo = $2`,
            [planId, periodo]
        );

        // Insertamos cada producto seleccionado para ese período
        for (const pId of productos) {
            await client.query(
                `INSERT INTO registrosMes (ps_id, rm_periodo, p_id) VALUES ($1, $2, $3)`,
                [planId, periodo, pId]
            );
        }

        await client.query('COMMIT');
        res.status(200).json({ mensaje: 'Registro mensual guardado con éxito' });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};