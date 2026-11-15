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

export const listarSuscripciones = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                s.s_id AS id,
                s.s_fecha_pago AS fecha_pago,
                s.s_monto_pago AS monto,
                s.cliente_id,
                p.pe_dni AS dni_cliente,
                p.pe_nombre AS nombre_cliente,
                s.ps_id AS plan_id,
                pl.ps_nombre AS plan_nombre,
                s.s_metodo_pago AS metodo_pago,
                s.activo
            FROM suscripcion s
            JOIN personas p ON s.cliente_id = p.pe_id
            JOIN planes pl ON s.ps_id = pl.ps_id
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};


export const obtener = async (req, res, next) => {
    try {
        let id = req.params.id;
        const { rows } = await pool.query('SELECT * FROM suscripcion WHERE s_id = $1', []);
       
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
        // Recibimos los datos que manda el frontend
        const { fecha_pago, monto_pago, metodo_pago, ps_id } = req.body;
        let cliente_id = req.usuario?.id 
        // Validación estricta de campos obligatorios según tu schema
        if (!fecha_pago || monto_pago === undefined || !cliente_id || !ps_id) {
            return res.status(400).json({ error: "Faltan datos obligatorios (fecha_pago, monto_pago, cliente_id, ps_id)" });
        }

        // Definimos un método de pago por defecto si no llega
        const metodoPagoFinal = metodo_pago || 'MercadoPago';

        const { rows } = await pool.query(
            `INSERT INTO suscripcion (s_fecha_pago, s_monto_pago, s_metodo_pago, cliente_id, ps_id, activo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [ fecha_pago, monto_pago, metodoPagoFinal, cliente_id, ps_id, true ]
        );
        
        res.status(201).json(rows[0]); // 201 Creado con éxito
    } catch(err) {
        
        if (err.code === '23503') {
            return res.status(400).json({ error: "El cliente o el plan de PLan de suscripción no existen" });
        }
        next(err);
    }
};
