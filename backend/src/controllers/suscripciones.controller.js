import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

// Inicializamos el cliente de Mercado Pago con el Access Token del vendedor
const mpClient = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
});

// HELPER INTERNO: Verifica el pago en MP y guarda en Postgres
async function registrarSuscripcionDesdePagoMP(paymentId) {
  const paymentClient = new Payment(mpClient);
  const payment = await paymentClient.get({ id: String(paymentId) });

  if (!payment || payment.status !== 'approved') {
    return { aprobado: false, status: payment?.status || 'unknown', suscripcion: null };
  }

  // Extraemos cliente_id y ps_id desde external_reference ("clienteId:planId")
  const [clienteIdStr, planIdStr] = String(payment.external_reference || '').split(':');
  const cliente_id = Number(clienteIdStr);
  const ps_id = Number(planIdStr);

  if (!cliente_id || !ps_id) {
    throw new Error('external_reference inválido en el pago de Mercado Pago');
  }

  // 1. Si este payment_id ya fue registrado (por el webhook o por el retorno), lo devolvemos
  const existente = await pool.query(
    'SELECT * FROM suscripcion WHERE s_mp_payment_id = $1',
    [String(paymentId)]
  );
  if (existente.rows.length > 0) {
    return { aprobado: true, status: 'approved', suscripcion: existente.rows[0] };
  }

  // 2. Insertamos una nueva instancia en PostgreSQL (ON CONFLICT evita duplicados concurrentes)
  const fechaPago = new Date().toISOString().split('T')[0];
  const montoPago = Number(payment.transaction_amount);

  const { rows } = await pool.query(
    `INSERT INTO suscripcion (s_fecha_pago, s_monto_pago, s_metodo_pago, cliente_id, ps_id, activo, s_mp_payment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (s_mp_payment_id) DO NOTHING
     RETURNING *`,
    [fechaPago, montoPago, 'MercadoPago', cliente_id, ps_id, true, String(paymentId)]
  );

  // Si hubo conflicto concurrente justo en ese milisegundo, consultamos el registro guardado
  if (rows.length === 0) {
    const { rows: yaGuardada } = await pool.query(
      'SELECT * FROM suscripcion WHERE s_mp_payment_id = $1',
      [String(paymentId)]
    );
    return { aprobado: true, status: 'approved', suscripcion: yaGuardada[0] };
  }

  return { aprobado: true, status: 'approved', suscripcion: rows[0] };
}

// ENDPOINTS DE MERCADO PAGO CHECKOUT PRO
export const crearPreferenciaMP = async (req, res, next) => {
  try {
    const cliente_id = req.usuario?.id;
    const { ps_id } = req.body;

    if (!cliente_id || !ps_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (cliente o plan).' });
    }

    // 1. Buscamos el plan en PostgreSQL para asegurar el precio real
    const { rows: planesRows } = await pool.query(
      'SELECT ps_id, ps_nombre, ps_descripcion, ps_valor, ps_activo FROM planes WHERE ps_id = $1',
      [ps_id]
    );

    if (planesRows.length === 0 || !planesRows[0].ps_activo) {
      return res.status(404).json({ error: 'El plan seleccionado no existe o no está disponible.' });
    }

    const plan = planesRows[0];

    // 2. Verificamos que el cliente no haya pagado ya ESTE MISMO plan en el mes calendario actual
    const { rows: subActiva } = await pool.query(
      `SELECT s_id FROM suscripcion 
       WHERE cliente_id = $1 
         AND ps_id = $2 
         AND DATE_TRUNC('month', s_fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)`,
      [cliente_id, ps_id]
    );

    if (subActiva.length > 0) {
      return res.status(409).json({ error: 'Ya poseés una suscripción activa para este plan en el mes actual.' });
    }

    // 3. Creamos la preferencia en Mercado Pago
    const frontendUrl = env.FRONTEND_URL.replace(/\/$/, '');
    const backendUrl = env.BACKEND_URL.replace(/\/$/, '');
    const urlRetorno = `${frontendUrl}/suscripciones/pago/resultado`;

    const preference = new Preference(mpClient);
    const bodyPreferencia = {
      items: [
        {
          id: String(plan.ps_id),
          title: `Suscripción María Balbina - Plan ${plan.ps_nombre}`,
          description: plan.ps_descripcion || `Membresía mensual Plan ${plan.ps_nombre}`,
          quantity: 1,
          unit_price: Number(plan.ps_valor),
          currency_id: 'ARS',
        },
      ],
      external_reference: `${cliente_id}:${plan.ps_id}`,
      back_urls: {
        success: urlRetorno,
        failure: urlRetorno,
        pending: urlRetorno,
      },
      ...(frontendUrl.startsWith('https://') && { auto_return: 'approved' }),
      ...(backendUrl.startsWith('https://') && {
        notification_url: `${backendUrl}/api/suscripciones/webhook`,
      }),
    };

    const result = await preference.create({ body: bodyPreferencia });

    res.status(201).json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/suscripciones/webhook (Pública - Llamada por Mercado Pago)
export const webhookMercadoPago = async (req, res) => {
  try {
    const tipo = req.body?.type || req.query?.type || req.query?.topic;
    const paymentId = req.body?.data?.id || req.query?.['data.id'] || req.query?.id;

    if (tipo === 'payment' && paymentId) {
      await registrarSuscripcionDesdePagoMP(paymentId);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error procesando webhook de Mercado Pago:', err.message);
    return res.sendStatus(200);
  }
};

// POST /api/suscripciones/verificar-pago (Protegida con JWT - Llamada desde React al volver)
export const verificarPagoMP = async (req, res, next) => {
  try {
    const { payment_id } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: 'Falta el payment_id para verificar el pago.' });
    }

    const resultado = await registrarSuscripcionDesdePagoMP(payment_id);

    if (!resultado.aprobado) {
      return res.status(400).json({
        error: `El pago aún no fue aprobado (estado: ${resultado.status}).`,
        status: resultado.status,
      });
    }

    return res.json({
      mensaje: 'Suscripción confirmada con éxito',
      status: resultado.status,
      suscripcion: resultado.suscripcion,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/suscripciones/mis-suscripciones (Protegida con JWT - Vista del Cliente)
// Activa = pagada dentro del mes calendario actual; meses anteriores pasan a Inactiva
export const obtenerMisSuscripciones = async (req, res, next) => {
  try {
    const clienteId = req.usuario?.id;

    if (!clienteId) {
      return res.status(401).json({ error: 'Usuario no identificado en el token.' });
    }

    const query = `
      SELECT 
        s.s_id AS id,
        s.s_fecha_pago AS fecha_pago,
        s.s_monto_pago AS monto,
        s.cliente_id,
        p.pe_dni AS dni_cliente,
        p.pe_nombre AS nombre_cliente,
        s.ps_id AS plan_id,
        pl.ps_nombre AS plan_nombre,
        s.s_metodo_pago AS metodo_pago,
        (DATE_TRUNC('month', s.s_fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)) AS activo
      FROM suscripcion s
      JOIN personas p ON s.cliente_id = p.pe_id
      JOIN planes pl ON s.ps_id = pl.ps_id
      WHERE s.cliente_id = $1
      ORDER BY 
        (DATE_TRUNC('month', s.s_fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)) DESC,
        s.s_fecha_pago DESC,
        s.s_id DESC
    `;

    const { rows } = await pool.query(query, [clienteId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const listarPersonasConSuscripcion = async (req, res, next) => {
  try {
    const query = `
      SELECT DISTINCT p.pe_id, p.pe_nombre, p.pe_dni, p.pe_mail
      FROM personas p
      JOIN suscripcion s ON p.pe_id = s.cliente_id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/suscripciones/listar (Protegida con JWT - Vista de Administración)
// Del 1 al 10 del mes: Activas = pagadas el mes anterior (cajas a armar/entregar).
// Del 11 en adelante: Activas = pagadas el mes actual (próxima entrega).
export const listarSuscripciones = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        s.s_id AS id,
        s.s_fecha_pago AS fecha_pago,
        s.s_monto_pago AS monto,
        s.cliente_id,
        p.pe_dni AS dni_cliente,
        p.pe_nombre AS nombre_cliente,
        s.ps_id AS plan_id,
        pl.ps_nombre AS plan_nombre,
        s.s_metodo_pago AS metodo_pago,
        CASE
          WHEN EXTRACT(DAY FROM CURRENT_DATE) <= 10 THEN
            DATE_TRUNC('month', s.s_fecha_pago) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          ELSE
            DATE_TRUNC('month', s.s_fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
        END AS activo
      FROM suscripcion s
      JOIN personas p ON s.cliente_id = p.pe_id
      JOIN planes pl ON s.ps_id = pl.ps_id
      ORDER BY activo DESC, s.s_fecha_pago DESC, s.s_id DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query('SELECT * FROM suscripcion WHERE s_id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { fecha_pago, monto_pago, metodo_pago, ps_id } = req.body;
    const cliente_id = req.usuario?.id;

    if (!fecha_pago || monto_pago === undefined || !cliente_id || !ps_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (fecha_pago, monto_pago, cliente_id, ps_id)' });
    }

    const metodoPagoFinal = metodo_pago || 'MercadoPago';

    const { rows } = await pool.query(
      `INSERT INTO suscripcion (s_fecha_pago, s_monto_pago, s_metodo_pago, cliente_id, ps_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [fecha_pago, monto_pago, metodoPagoFinal, cliente_id, ps_id, true]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'El cliente o el plan de suscripción no existen' });
    }
    next(err);
  }
};