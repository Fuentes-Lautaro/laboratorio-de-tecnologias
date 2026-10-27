import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';


//CLIENTES

// Listar clientes
export const listarClientes = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo 
       FROM personas 
       WHERE pe_rol = 'cliente' 
       ORDER BY pe_activo DESC, pe_nombre ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Crear un cliente nuevo
export const crearCliente = async (req, res, next) => {
  try {
    const { dni, nombre, fechaNac, telefono, mail, direccion, password } = req.body;

    if (!dni || !nombre || !mail || !password) {
      return res.status(400).json({ error: 'DNI, nombre, mail y password son obligatorios' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol, pe_activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'cliente', TRUE)
      RETURNING pe_id, pe_dni, pe_nombre, pe_mail, pe_rol, pe_activo;
    `;
    const values = [dni, nombre, fechaNac, telefono, mail, direccion, passwordHash];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      mensaje: 'Cliente creado con éxito',
      cliente: rows[0]
    });
  } catch (err) {
    next(err);
  }
};



//EMPLEADOS / PERSONAL

// Listar empleados (Opcionalmente se puede filtrar por rol con ?rol=cm)
export const listarEmpleados = async (req, res, next) => {
  try {
    const { rol } = req.query; // Ejemplo: /api/empleados?rol=cm

    let query = `
      SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo 
      FROM personas 
      WHERE pe_rol != 'cliente'
    `;
    const values = [];

    if (rol) {
      query += ` AND pe_rol = $1`;
      values.push(rol.trim().toLowerCase());
    }

    query += ` ORDER BY pe_activo DESC, pe_nombre ASC`;

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Crear un empleado nuevo (guarda el rol en minúscula)
export const crearEmpleado = async (req, res, next) => {
  try {
    const { dni, nombre, fechaNac, telefono, mail, direccion, password, rol } = req.body;

    if (!dni || !nombre || !mail || !password || !rol) {
      return res.status(400).json({ error: 'DNI, nombre, mail, password y rol son obligatorios' });
    }

    const rolMinuscula = rol.trim().toLowerCase();

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol, pe_activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING pe_id, pe_dni, pe_nombre, pe_mail, pe_rol, pe_activo;
    `;
    const values = [dni, nombre, fechaNac, telefono, mail, direccion, passwordHash, rolMinuscula];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      mensaje: 'Empleado creado con éxito',
      empleado: rows[0]
    });
  } catch (err) {
    next(err);
  }
};


//MÉTODOS COMUNES (Detalle, Actualizar, Cambiar Estado)


// Obtener detalle de cualquier persona por ID
export const detallePersona = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo 
       FROM personas WHERE pe_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Actualizar datos de un usuario
export const actualizarPersona = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, direccion, fechaNac, rol } = req.body;
    
    const rolMinuscula = rol ? rol.trim().toLowerCase() : null;

    const { rows } = await pool.query(
      `UPDATE personas 
       SET pe_nombre = COALESCE($1, pe_nombre), 
           pe_telefono = COALESCE($2, pe_telefono), 
           pe_direccion = COALESCE($3, pe_direccion), 
           pe_fechaNac = COALESCE($4, pe_fechaNac), 
           pe_rol = COALESCE($5, pe_rol)
       WHERE pe_id = $6
       RETURNING pe_id, pe_dni, pe_nombre, pe_mail, pe_rol, pe_activo`,
      [nombre, telefono, direccion, fechaNac, rolMinuscula, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

//Baja lógica de usuario Activar o Desactivar
export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const { rows } = await pool.query(
      'UPDATE personas SET pe_activo = $1 WHERE pe_id = $2 RETURNING pe_id, pe_activo, pe_rol',
      [activo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};