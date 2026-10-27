import { pool } from '../config/db.js';

// Listar personas (soporta filtrado opcional por rol usando query params: /api/personas?rol=cliente)
export const listar = async (req, res, next) => {
  try {
    const { tipo } = req.query; //toma por parametro al rol que viene

    let query = `
      SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo 
      FROM personas
    `;
    const values = [];

    if (tipo === 'cliente') { //si viene cliente entra en esta rama
      query += ' WHERE pe_rol = $1';
      values.push('cliente');
    } else if (tipo) { //si no viene cliente, es por esta rama
      query += ' WHERE pe_rol != $1';
      values.push('cliente');
    }

    query += ' ORDER BY pe_activo DESC, pe_nombre ASC'; //concateno al final para que agrupe y ordene

    const { rows } = await pool.query(query, values); //hago la consulta
    res.json(rows); //devuelvo 
  } catch (err) {
    next(err);
  }
};

// Obtener detalle de una persona por ID
export const detalle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT pe_id, pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_rol, pe_activo FROM personas WHERE pe_id = $1',
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

// Actualizar datos de una persona (PUT)
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, direccion, fechaNac, rol } = req.body;

    const { rows } = await pool.query(
      `UPDATE personas 
       SET pe_nombre = $1, pe_telefono = $2, pe_direccion = $3, pe_fechaNac = $4, pe_rol = $5
       WHERE pe_id = $6
       RETURNING pe_id, pe_dni, pe_nombre, pe_mail, pe_rol, pe_activo`,
      [nombre, telefono, direccion, fechaNac, rol, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Baja lógica de usuario (PATCH o DELETE)
export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const { rows } = await pool.query(
      'UPDATE personas SET pe_activo = $1 WHERE pe_id = $2 RETURNING pe_id, pe_activo',
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