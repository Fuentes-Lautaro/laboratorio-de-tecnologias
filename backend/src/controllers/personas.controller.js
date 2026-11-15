import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const listarPersonas = async (req, res, next) => {
  try {
    const tieneParametros = Object.keys(req.query).length > 0;

    if (!tieneParametros) {
      const { rows } = await pool.query(
        `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo
         FROM personas
         WHERE LOWER(pe_rol) = 'cliente'
         ORDER BY pe_activo DESC, pe_nombre ASC`
      );
      return res.json(rows);
    }

    // Solo el gerente puede consultar empleados
    const rolUsuario = req.usuario?.rol?.toLowerCase() || '';
    if (rolUsuario !== 'gerente') {
      return res.status(403).json({
        error: 'Acceso denegado: solo el gerente puede consultar el listado de empleados'
      });
    }

    const { rows } = await pool.query(
      `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo
       FROM personas
       WHERE LOWER(pe_rol) != 'cliente'
       ORDER BY 
         pe_activo DESC,
         CASE LOWER(pe_rol)
           WHEN 'vendedor' THEN 1
           WHEN 'cm' THEN 2
           WHEN 'gerente' THEN 3
           ELSE 4
         END ASC,
         pe_nombre ASC`
    );

    return res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Buscar persona por DNI (para autocompletar en Ventas)
// Buscar persona por DNI (para autocompletar o reactivar en Ventas)
export const buscarPorDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const { rows } = await pool.query(
      `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo
       FROM personas
       WHERE pe_dni = $1`,
      [String(dni).trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    return res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Crear persona (cliente o empleado según el rol enviado)
export const crearPersona = async (req, res, next) => {
  try {
    const { dni, nombre, fechaNac, telefono, mail, direccion, password, clave, rol } = req.body;
    const rolFinal = rol ? rol.trim().toLowerCase() : 'cliente';
    const rolUsuario = req.usuario?.rol?.toLowerCase() || '';

    // Solo el gerente puede dar de alta usuarios con rol distinto a cliente
    if (rolFinal !== 'cliente' && rolUsuario !== 'gerente') {
      return res.status(403).json({
        error: 'Acceso denegado: solo el gerente puede registrar empleados'
      });
    }

    // Si es un alta rápida de cliente desde Ventas y no se envía clave, se usa su DNI como clave inicial
    const clavePlana = password || clave || (rolFinal === 'cliente' && dni ? String(dni).trim() : null);

    if (!dni || !nombre || !mail || !clavePlana) {
      return res.status(400).json({ error: 'DNI, nombre, mail y contraseña son obligatorios' });
    }

    if (rolFinal === 'cliente' && (!fechaNac || !telefono)) {
      return res.status(400).json({ error: 'Fecha de nacimiento y teléfono son obligatorios para registrar un cliente' });
    }

    const passwordHash = await bcrypt.hash(clavePlana, SALT_ROUNDS);

    const { rows } = await pool.query(
      `INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol, pe_activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo`,
      [
        String(dni).trim(),
        nombre.trim(),
        fechaNac || null,
        telefono || null,
        mail.trim(),
        direccion && direccion.trim() !== '' ? direccion.trim() : null,
        passwordHash,
        rolFinal
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una persona registrada con ese DNI o Email' });
    }
    next(err);
  }
};

// Obtener detalle de una persona por ID
export const detallePersona = async (req, res, next) => {
  try {
    const id = req.params.id || req.usuario?.id;
    const { rows } = await pool.query(
      `SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo
       FROM personas
       WHERE pe_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const persona = rows[0];
    const rolUsuario = req.usuario?.rol?.toLowerCase() || '';
    if (persona.pe_rol?.toLowerCase() !== 'cliente' && rolUsuario !== 'gerente') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(persona);
  } catch (err) {
    next(err);
  }
};

// Obtener detalle público del usuario logueado
export const detallePublicoPersona = async (req, res, next) => {
  try {
    let id = req.usuario?.id;
    const { rows } = await pool.query(
      `SELECT pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_activo
       FROM personas
       WHERE pe_id = $1`,
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

export const actualizarPersona = async (req, res, next) => {
  try {
    let id = req.usuario?.id;
    const { nombre, telefono, direccion, fechaNac, rol, password, mail } = req.body;
    const rolUsuario = req.usuario?.rol?.toLowerCase() || '';

    const actual = await pool.query('SELECT pe_rol FROM personas WHERE pe_id = $1', [id]);
    if (actual.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rolActual = actual.rows[0].pe_rol?.toLowerCase();
    const rolNuevo = rol ? rol.trim().toLowerCase() : null;

    if ((rolActual !== 'cliente' || (rolNuevo && rolNuevo !== 'cliente')) && rolUsuario !== 'gerente') {
      return res.status(403).json({
        error: 'Acceso denegado: solo el gerente puede modificar empleados o asignar roles'
      });
    }

    const clavePlana = password;
    const passwordHash = clavePlana ? await bcrypt.hash(clavePlana, SALT_ROUNDS) : null;

    const { rows } = await pool.query(
      `UPDATE personas
       SET pe_nombre = COALESCE($1, pe_nombre),
           pe_telefono = COALESCE($2, pe_telefono),
           pe_direccion = COALESCE($3, pe_direccion),
           pe_fechaNac = COALESCE($4, pe_fechaNac),
           pe_rol = COALESCE($5, pe_rol),
           pe_password = COALESCE($6, pe_password),
           pe_mail = COALESCE($7, pe_mail)
       WHERE pe_id = $8
       RETURNING pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo`,
      [nombre, telefono, direccion, fechaNac, rolNuevo, passwordHash, mail, id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Baja / Alta lógica de usuario (Activar o Desactivar)
export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rolUsuario = req.usuario?.rol?.toLowerCase() || '';

    const actual = await pool.query('SELECT pe_rol FROM personas WHERE pe_id = $1', [id]);
    if (actual.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (actual.rows[0].pe_rol?.toLowerCase() !== 'cliente' && rolUsuario !== 'gerente') {
      return res.status(403).json({
        error: 'Acceso denegado: solo el gerente puede dar de baja o alta a empleados'
      });
    }

    const { rows } = await pool.query(
      `UPDATE personas
       SET pe_activo = NOT pe_activo
       WHERE pe_id = $1
       RETURNING pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo`,
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Función pública para cambiar datos
export const actualizarme = async (req, res, next) => {
  try {
    let id = req.usuario?.id;
    const { nombre, telefono, direccion, fechaNac, password, mail } = req.body;

    const clavePlana = password;
    const passwordHash = clavePlana ? await bcrypt.hash(clavePlana, SALT_ROUNDS) : null;

    const { rows } = await pool.query(
      `UPDATE personas
       SET pe_nombre = COALESCE($1, pe_nombre),
           pe_telefono = COALESCE($2, pe_telefono),
           pe_direccion = COALESCE($3, pe_direccion),
           pe_fechaNac = COALESCE($4, pe_fechaNac),
           pe_password = COALESCE($5, pe_password),
           pe_mail = COALESCE($6, pe_mail)
       WHERE pe_id = $7
       RETURNING pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo`,
      [nombre, telefono, direccion, fechaNac, passwordHash, mail, id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};