import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';


// LISTAR TODOS LOS CLIENTES (Con información completa de personas)
export const listar = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                c.cli_id, 
                p.pe_dni, 
                p.pe_nombre, 
                p.pe_fechaNac, 
                p.pe_telefono, 
                p.pe_mail, 
                p.pe_direccion, 
                p.pe_activo
            FROM clientes c
            JOIN personas p ON c.cli_id = p.pe_id
            ORDER BY c.cli_id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// DETALLE DE UN CLIENTE POR ID (Con información completa de personas)
export const detalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                c.cli_id, 
                p.pe_dni, 
                p.pe_nombre, 
                p.pe_fechaNac, 
                p.pe_telefono, 
                p.pe_mail, 
                p.pe_direccion, 
                p.pe_activo
            FROM clientes c
            JOIN personas p ON c.cli_id = p.pe_id
            WHERE c.cli_id = $1;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// CREAR CLIENTE
export const crear = async (req, res, next) => {
    const client = await pool.connect(); // Transacción para asegurar integridad
    try {
        await client.query('BEGIN');

        const { dni, nombre, fechaNac, telefono, mail, direccion, password, activo } = req.body;

        if (!dni || !nombre || !mail || !password) {
            return res.status(400).json({ error: "DNI, nombre, mail y password son obligatorios" });
        }

        const estadoActivo = activo !== undefined ? activo : true;

        // Hashear la contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insertar en la tabla base: 'personas'
        const queryPersona = `
            INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_activo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING pe_id;
        `;
        const valuesPersona = [dni, nombre, fechaNac, telefono, mail, direccion, passwordHash, estadoActivo];
        const resPersona = await client.query(queryPersona, valuesPersona);
        const nuevoPeId = resPersona.rows[0].pe_id;

        
        const queryCliente = `
            INSERT INTO clientes (cli_id)
            VALUES ($1)
            RETURNING cli_id;
        `;
        await client.query(queryCliente, [nuevoPeId]);

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: "Cliente creado con éxito",
            clienteId: nuevoPeId,
            dni
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// MODIFICAR CLIENTE 
export const modificar = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { nombre, fechaNac, telefono, mail, direccion, activo } = req.body;

        const query = `
            UPDATE personas 
            SET 
                pe_nombre = COALESCE($1, pe_nombre),
                pe_fechaNac = COALESCE($2, pe_fechaNac),
                pe_telefono = COALESCE($3, pe_telefono),
                pe_mail = COALESCE($4, pe_mail),
                pe_direccion = COALESCE($5, pe_direccion),
                pe_activo = COALESCE($6, pe_activo)
            WHERE pe_id = (SELECT cli_id FROM clientes WHERE cli_id = $7)
            RETURNING *;
        `;
        
        const values = [nombre, fechaNac, telefono, mail, direccion, activo, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json({
            mensaje: "Cliente actualizado con éxito",
            persona: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR CLIENTE
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params; // cli_id / pe_id
        const query = `DELETE FROM personas WHERE pe_id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};