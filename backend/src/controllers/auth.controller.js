import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

//POST PARA CREAR UNA CUENTA
export const registro = async (req, res, next) => {
    try{
        const { dni, nombre, fechaNac, telefono, mail, direccion, password } = req.body;
        if (!nombre || !dni || !fechaNac || !mail || !password) {
            return res.status(400).json({ error: 'Nombre, dni, fechaNac, email y clave son obligatorios' });
        }
        
        const hash = await bcrypt.hash(password, SALT_ROUNDS); //CONTRASENIA HASHEADA

        const { rows } = await pool.query(
            `INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING pe_id, pe_dni, pe_mail`,
            [dni, nombre, fechaNac, telefono, mail, direccion, hash]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        next(err);
    }
};

//POST PARA LOGIN
export const login = async (req, res, next) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    // 1. Buscar al usuario por mail
    const { rows } = await pool.query('SELECT * FROM personas WHERE pe_mail = $1', [mail]);
    const persona = rows[0];

    // 2. Comparar la contraseña recibida con el hash guardado
    const passwordOk = persona && (await bcrypt.compare(password, persona.pe_password));

    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Firmar el token con datos mínimos (nunca la contraseña)
    const token = jwt.sign(
      { id: persona.pe_id, nombre: persona.pe_nombre, mail: persona.pe_mail }, // payload
      env.JWT_SECRET, // clave secreta del servidor
      { expiresIn: env.JWT_EXPIRES_IN } // vencimiento
    );

    // 4. Devolver el token: a partir de acá el cliente lo manda en cada pedido
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

//PARA OBTENER TODOS LOS CLIENTES
export const todos = async (req, res, next) => {
  try{
    const { rows } = await pool.query(
      `SELECT p.pe_id, p.pe_dni, p.pe_nombre, p.pe_fechaNac, p.pe_telefono, p.pe_mail, p.pe_direccion, p.pe_activo
      FROM personas p
      INNER JOIN clientes c ON p.pe_id = c.cli_codigo
      ORDER BY  p.pe_activo DESC, p.pe_nombre ASC`);
    res.json(rows)
  }
  catch (err){
    next(err)
  }
}