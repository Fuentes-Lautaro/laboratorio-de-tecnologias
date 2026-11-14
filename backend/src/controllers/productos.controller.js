import { pool } from '../config/db.js';

// Función auxiliar para verificar si existe un producto con la misma combinación
async function buscarProductoDuplicado({ marca, tipo, varietal, medida, bodega, anio }, excluirId = null) {
  const anioNormalizado = anio !== '' && anio !== null && anio !== undefined ? Number(anio) : null;

  const query = `
    SELECT * FROM productos
    WHERE LOWER(TRIM(p_marca)) = LOWER(TRIM($1))
      AND LOWER(TRIM(p_tipo)) = LOWER(TRIM($2))
      AND LOWER(TRIM(COALESCE(p_varietal, ''))) = LOWER(TRIM(COALESCE($3, '')))
      AND LOWER(TRIM(p_medida)) = LOWER(TRIM($4))
      AND LOWER(TRIM(p_bodega)) = LOWER(TRIM($5))
      AND COALESCE(p_anio, 0) = COALESCE($6, 0)
      ${excluirId ? 'AND p_id <> $7' : ''}
    LIMIT 1
  `;

  const params = [
    marca,
    tipo,
    varietal || null,
    medida,
    bodega,
    anioNormalizado,
    ...(excluirId ? [excluirId] : [])
  ];

  const { rows } = await pool.query(query, params);
  return rows[0] || null;
}

export const listar = async (req, res, next) => {
  try {
    const { marca, tipo, varietal, bodega, medida } = req.query;

    let query = 'SELECT * FROM productos WHERE 1=1';
    const values = [];

    const agregarFiltroMultiple = (columna, valorQuery) => {
      if (!valorQuery) return;
      const lista = String(valorQuery)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      if (lista.length > 0) {
        values.push(lista);
        query += ` AND ${columna} = ANY($${values.length})`;
      }
    };

    agregarFiltroMultiple('p_marca', marca);
    agregarFiltroMultiple('p_tipo', tipo);
    agregarFiltroMultiple('p_varietal', varietal);
    agregarFiltroMultiple('p_bodega', bodega);
    agregarFiltroMultiple('p_medida', medida);
    
    query += `
      ORDER BY 
        CASE 
          WHEN p_activo = true AND p_stock > 0 THEN 1
          WHEN p_activo = true AND p_stock <= 0 THEN 2
          ELSE 3
        END ASC,
        p_precio ASC
    `;

    const { rows } = await pool.query(query, values);
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
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock } = req.body;

    if (!marca?.trim() || !tipo?.trim() || !medida?.trim() || !bodega?.trim()) {
      return res.status(400).json({ error: 'Marca, tipo, bodega y medida son obligatorios.' });
    }

    const duplicado = await buscarProductoDuplicado({ marca, tipo, varietal, medida, bodega, anio });
    
    if (duplicado) {
      if (!duplicado.p_activo) {
        return res.status(409).json({
          error: 'Este producto ya existe en el sistema pero se encuentra inactivo.',
          productoInactivo: duplicado
        });
      }
      return res.status(409).json({
        error: 'Ya existe un producto activo con la misma marca, tipo, varietal, medida, bodega y año.'
      });
    }

    const anioVal = anio !== '' && anio !== null && anio !== undefined ? Number(anio) : null;

    const { rows } = await pool.query(
      `INSERT INTO productos (p_marca, p_tipo, p_precio, p_costo, p_anio, p_medida, p_varietal, p_bodega, p_descripcion, p_imagen_url, p_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [marca.trim(), tipo.trim(), precio, costo || 0, anioVal, medida.trim(), varietal?.trim() || null, bodega.trim(), descripcion, img, stock ?? 0]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un producto con la misma marca, tipo, varietal, medida, bodega y año.'
      });
    }
    next(err);
  }
};

export const modificar = async (req, res, next) => {
  try {
    const { marca, tipo, precio, costo, anio, medida, varietal, bodega, descripcion, img, stock } = req.body;
    const { id } = req.params;

    if (!marca?.trim() || !tipo?.trim() || !medida?.trim() || !bodega?.trim()) {
      return res.status(400).json({ error: 'Marca, tipo, bodega y medida son obligatorios.' });
    }

    const duplicado = await buscarProductoDuplicado({ marca, tipo, varietal, medida, bodega, anio }, id);

    if (duplicado) {
      if (!duplicado.p_activo) {
        return res.status(409).json({
          error: 'Ya existe otro producto con esos mismos datos pero se encuentra inactivo.',
          productoInactivo: duplicado
        });
      }
      return res.status(409).json({
        error: 'Ya existe otro producto activo con la misma marca, tipo, varietal, medida, bodega y año.'
      });
    }

    const anioVal = anio !== '' && anio !== null && anio !== undefined ? Number(anio) : null;

    const { rows } = await pool.query(
      `UPDATE productos
       SET p_marca = $1, p_tipo = $2, p_precio = $3, p_costo = $4, p_anio = $5, p_medida = $6, p_varietal = $7, p_bodega = $8, p_descripcion = $9, p_imagen_url = $10, p_stock = $11
       WHERE p_id = $12
       RETURNING *`,
      [marca.trim(), tipo.trim(), precio, costo || 0, anioVal, medida.trim(), varietal?.trim() || null, bodega.trim(), descripcion, img, stock ?? 0, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe otro producto con la misma marca, tipo, varietal, medida, bodega y año.'
      });
    }
    next(err);
  }
};

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
};