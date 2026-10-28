import { pool } from '../config/db.js'

export const listar = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM productos 
      ORDER BY 
        CASE 
          WHEN p_activo = true AND p_stock > 0 THEN 1
          WHEN p_activo = true AND p_stock <= 0 THEN 2
          ELSE 3
        END ASC,
        p_precio ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const detalle = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM productos p WHERE p.p_id = $1', [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (err){
        next(err);
    }
}

export const crear = async (req, res, next) => {
    try {
        const { marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO productos (p_marca, p_tipo, p_precio, p_costo, p_anio, p_medida, p_varietal, p_bodega, p_descripcion, p_imagen_url, p_stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock]
        );
        res.status(201).json(rows[0]);
    } catch(err){
        next(err);
    }
}

export const modificar = async (req, res, next) => {
    try {
        const { marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock } = req.body;
        const { rows } = await pool.query(
            `UPDATE productos
            SET p_marca = $1, p_tipo = $2, p_precio = $3, p_costo = $4, p_anio = $5, p_medida = $6, p_varietal = $7, p_bodega = $8, p_descripcion = $9, p_imagen_url = $10, p_stock = $11
            WHERE p_id = $12
            RETURNING *`,
            [marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock, req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
}

export const alternar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'UPDATE productos SET p_activo = NOT p_activo WHERE p_id = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const eliminar = async (req, res, next) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM productos WHERE p_id = $1', [
            req.params.id,
        ]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}