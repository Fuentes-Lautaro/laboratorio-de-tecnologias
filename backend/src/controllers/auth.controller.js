import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

//POST PARA CREAR UNA CUENTA
export const registro = async (req, res, next) => {
    try{
        const { nombre, dni, fechaNac, telefono, mail, direccion, password } = req.body;
        if (!nombre || !dni || !fechaNac || !mail || !password) {
            return res.status(400).json({ error: 'Nombre, dni, fechaNac, email y clave son obligatorios' });
        }
        
        const hash = await bcrypt.hash(password, SALT_ROUNDS); //CONTRASENIA HASHEADA

        const { rows } = pool.query(
            `INSERT INTO usuarios (nombre, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, mail`,
            [nombre, dni, fechaNac, telefono, mail, direccion, hash]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        next(err);
    }
};