import { pool } from '../config/db.js'


export const listarPersonasConSuscripcion = async (req, res, next) => {
    try {
        // Usamos DISTINCT y JOIN para traer solo los datos de las personas que figuran en la tabla suscripcion
        const query = `
            SELECT DISTINCT p.pe_id, p.pe_nombre, p.pe_dni, p.pe_mail
            FROM personas p
            JOIN suscripcion s ON p.pe_id = s.cliente_id
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
}


export const obtener = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM suscripcion WHERE s_id = $1', [req.params.id]);
       
        if (rows.length === 0) {
            return res.status(404).json({ error: "Suscripción no encontrada" });
        }
       
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
}


export const crear = async (req, res, next) => {
    try {
        const { fecha_pago, monto_pago, cliente_id, ps_id } = req.body;
       
        // Validación de datos de entrada obligatorios antes de llegar a la base de datos
        if (!fecha_pago || monto_pago === undefined || !cliente_id || !ps_id) {
            return res.status(400).json({ error: "Faltan datos obligatorios (fecha_pago, monto_pago, cliente_id, ps_id)" });
        }


        const { rows } = await pool.query(
            `INSERT INTO suscripcion (s_fecha_pago, s_monto_pago, cliente_id, ps_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [ fecha_pago, monto_pago, cliente_id, ps_id ]
        );
       
        res.status(201).json(rows[0]); // 201 Creado
    } catch(err) {
        // Si el cliente_id o ps_id no existen, PostgreSQL lanzará un error de Foreign Key (código 23503)
        if (err.code === '23503') {
            return res.status(400).json({ error: "El cliente o el plan de suscripción no existen" });
        }
        next(err);
    }
}
