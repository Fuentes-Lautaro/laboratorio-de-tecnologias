import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

//POST PARA CREAR UNA CUENTA
export const registro = async (req, res, next) => {
  try {
    const { dni, nombre, fechaNac, telefono, mail, direccion, password, rol } = req.body;

    if (!nombre || !dni || !fechaNac || !mail || !password) {
      return res.status(400).json({ 
        error: 'Nombre, DNI, fecha de nacimiento, email y clave son obligatorios' 
      });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const rolUsuario = rol || 'cliente';

    const { rows } = await pool.query(
      `INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING pe_id, pe_dni, pe_nombre, pe_mail, pe_rol, pe_activo`,
      [dni, nombre, fechaNac, telefono, mail, direccion, hash, rolUsuario]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'Ya existe un usuario registrado con ese DNI o Email' 
      });
    }
    next(err);
  }
};

//POST PARA LOGIN
export const login = async (req, res, next) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // 1. Buscar al usuario por mail
    const { rows } = await pool.query('SELECT * FROM personas WHERE pe_mail = $1 AND pe_activo', [mail]);
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
    res.json({ token, rol: persona.pe_rol });
  } catch (err) {
    next(err);
  }
};