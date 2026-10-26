import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// LISTAR TODO EL PERSONAL (Con información completa de personas)
export const listar = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                pers.pers_id, 
                pers.p_rol,
                p.pe_dni, 
                p.pe_nombre, 
                p.pe_fechaNac, 
                p.pe_telefono, 
                p.pe_mail, 
                p.pe_direccion, 
                p.pe_activo
            FROM personal pers
            JOIN personas p ON pers.pers_id = p.pe_id
            ORDER BY pers.pers_id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// DETALLE DE UN PERSONAL POR ID (Con información completa de personas)
export const detalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                pers.pers_id,
                pers.p_rol, 
                p.pe_dni, 
                p.pe_nombre, 
                p.pe_fechaNac, 
                p.pe_telefono, 
                p.pe_mail, 
                p.pe_direccion, 
                p.pe_activo
            FROM personal pers
            JOIN personas p ON pers.pers_id = p.pe_id
            WHERE pers.pers_id = $1;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Personal no encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// CREAR PERSONAL
export const crear = async (req, res, next) => {
    const client = await pool.connect(); // Transacción para asegurar integridad
    try {
        await client.query('BEGIN');

        const { dni, nombre, fechaNac, telefono, mail, direccion, password, activo, rol} = req.body;

        if (!dni || !nombre || !mail || !password || !rol) {
            return res.status(400).json({ error: "DNI, nombre, mail y password son obligatorios" });
        }

        const estadoActivo = activo !== undefined ? activo : true;

        // 1. Hashear la contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 2. Insertar en la tabla base: 'personas'
        const queryPersona = `
            INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_activo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING pe_id;
        `;
        const valuesPersona = [dni, nombre, fechaNac, telefono, mail, direccion, passwordHash, estadoActivo];
        const resPersona = await client.query(queryPersona, valuesPersona);
        const nuevoPeId = resPersona.rows[0].pe_id;

        // 3. Insertar en la tabla 'personal'
        const queryPersonal = `
            INSERT INTO personal (pers_id, p_rol)
            VALUES ($1, $2)
            RETURNING pers_id;
        `;
        await client.query(queryPersonal, [nuevoPeId, rol]);

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: "Personal creado con éxito",
            personalId: nuevoPeId,
            dni
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// MODIFICAR PERSONAL (Actualiza datos de personas, estado y rol)
export const modificar = async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params; // El pers_id / pe_id del empleado
        const { nombre, fechaNac, telefono, mail, direccion, activo, p_rol } = req.body;

        // 1. Actualizar los datos en la tabla 'personas'
        const queryPersona = `
            UPDATE personas 
            SET 
                pe_nombre = COALESCE($1, pe_nombre),
                pe_fechaNac = COALESCE($2, pe_fechaNac),
                pe_telefono = COALESCE($3, pe_telefono),
                pe_mail = COALESCE($4, pe_mail),
                pe_direccion = COALESCE($5, pe_direccion),
                pe_activo = COALESCE($6, pe_activo)
            WHERE pe_id = (SELECT pers_id FROM personal WHERE pers_id = $7)
            RETURNING *;
        `;
        const valuesPersona = [nombre, fechaNac, telefono, mail, direccion, activo, id];
        const resultPersona = await client.query(queryPersona, valuesPersona);

        if (resultPersona.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Personal no encontrado" });
        }

        // 2. Actualizar el rol en la tabla 'personal'
        const queryPersonal = `
            UPDATE personal 
            SET p_rol = COALESCE($1, p_rol)
            WHERE pers_id = $2
            RETURNING *;
        `;
        const valuesPersonal = [p_rol, id];
        const resultPersonal = await client.query(queryPersonal, valuesPersonal);

        await client.query('COMMIT');

        // Unimos la respuesta para devolver el objeto completo actualizado
        res.json({
            mensaje: "Personal actualizado con éxito",
            personal: {
                ...resultPersona.rows[0],
                p_rol: resultPersonal.rows[0].p_rol
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// ELIMINAR PERSONAL
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params; // pers_id / pe_id
        const query = `DELETE FROM personas WHERE pe_id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Personal no encontrado" });
        }

        res.json({ mensaje: "Personal eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};