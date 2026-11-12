import { pool } from '../config/db.js';

export const obtenerResumenEstadisticas = async (req, res, next) => {
    try {
        // Total de ingresos mensuales (mes actual)
        const queryIngresos = `
            SELECT COALESCE(SUM(v_total), 0) AS "totalIngresosMensuales" 
            FROM ventas 
            WHERE DATE_TRUNC('month', v_fecha) = DATE_TRUNC('month', CURRENT_DATE);
        `;
        const resIngresos = await pool.query(queryIngresos);

        // Suscripciones activas
        const querySuscripciones = `
            SELECT COUNT(*) AS "suscripcionesActivas" 
            FROM suscripcion;
        `;
        const resSuscripciones = await pool.query(querySuscripciones);

        // Clientes registrados
        const queryClientes = `
            SELECT COUNT(*) AS "clientesRegistrados" 
            FROM personas 
            WHERE pe_rol = 'cliente';
        `;
        const resClientes = await pool.query(queryClientes);

        // Distribución por plan e ingresos asociados
        const queryDistribucion = `
            SELECT 
                p.ps_id AS "planId",
                p.ps_nombre AS nombre,
                COUNT(s.s_id) AS "cantidadSuscripciones",
                COALESCE(SUM(s.s_monto_pago), 0) AS ingresos
            FROM planes p
            LEFT JOIN suscripcion s ON p.ps_id = s.ps_id
            GROUP BY p.ps_id, p.ps_nombre
            ORDER BY p.ps_id ASC;
        `;
        const resDistribucion = await pool.query(queryDistribucion);

        // Determinamos el plan más vendido/con más suscripciones
        let planMasVendido = 'Ninguno';
        let maxSuscripciones = -1;
        resDistribucion.rows.forEach(row => {
            const cant = Number(row.cantidadSuscripciones);
            if (cant > maxSuscripciones) {
                maxSuscripciones = cant;
                planMasVendido = row.nombre;
            }
        });

        // Top 3 métodos de pago más usados (general, con % sobre el total de ventas)
        const queryMetodosPago = `
            SELECT 
                COALESCE(v_metodo_pago, 'Sin especificar') AS metodo,
                COUNT(*) AS cantidad,
                ROUND((COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0)), 1) AS porcentaje
            FROM ventas
            GROUP BY v_metodo_pago
            ORDER BY cantidad DESC, metodo ASC
            LIMIT 3;
        `;
        const resMetodos = await pool.query(queryMetodosPago);

        const metodosPagoMasUsados = resMetodos.rows.map(row => ({
            metodo: row.metodo,
            cantidad: Number(row.cantidad),
            porcentaje: Number(row.porcentaje)
        }));

        // Top Productos más vendidos (general)
        const queryTopProductos = `
            SELECT 
                TRIM(pr.p_marca || ' ' || COALESCE(pr.p_varietal, '')) AS producto,
                SUM(rv.iv_cantidad) AS "unidadesVendidas",
                SUM(rv.iv_cantidad * rv.iv_precio_unidad) AS "totalRecaudado"
            FROM reglones_venta rv
            JOIN productos pr ON rv.producto_codigo = pr.p_id
            GROUP BY pr.p_id, pr.p_marca, pr.p_varietal
            ORDER BY "unidadesVendidas" DESC
            LIMIT 5;
        `;
        const resTopProductos = await pool.query(queryTopProductos);

        // Próximos eventos activos
        const queryEventos = `
            SELECT 
                e_nombre AS nombre,
                e_fecha AS fecha,
                e_cant_asist AS cupos
            FROM eventos
            WHERE e_fecha >= CURRENT_DATE
              AND e_activo = true
            ORDER BY e_fecha ASC
            LIMIT 3;
        `;
        const resEventos = await pool.query(queryEventos);

        // 1. Eventos pasados y activos: cantidad de ventas y monto total recaudado
        const queryEventosEstadisticas = `
            SELECT 
                e.e_id AS "eventoId",
                e.e_nombre AS nombre,
                e.e_fecha AS fecha,
                COUNT(v.v_codigo) AS "cantidadVentas",
                COALESCE(SUM(v.v_total), 0) AS "totalRecaudado"
            FROM eventos e
            LEFT JOIN ventas v ON v.evento_id = e.e_id
            WHERE e.e_activo = true
              AND e.e_fecha < CURRENT_DATE
            GROUP BY e.e_id, e.e_nombre, e.e_fecha
            ORDER BY e.e_fecha DESC, e.e_id DESC;
        `;
        const resEventosEstadisticas = await pool.query(queryEventosEstadisticas);

        // 2. Top 3 vinos vendidos por cada evento pasado y activo
        const queryTopVinosEvento = `
            WITH ranking_vinos AS (
                SELECT 
                    v.evento_id AS "eventoId",
                    TRIM(pr.p_marca || ' ' || COALESCE(pr.p_varietal, '')) AS producto,
                    SUM(rv.iv_cantidad) AS "unidadesVendidas",
                    ROW_NUMBER() OVER (
                        PARTITION BY v.evento_id 
                        ORDER BY SUM(rv.iv_cantidad) DESC, pr.p_marca ASC
                    ) AS rn
                FROM ventas v
                JOIN eventos e ON v.evento_id = e.e_id
                JOIN reglones_venta rv ON rv.venta_codigo = v.v_codigo
                JOIN productos pr ON rv.producto_codigo = pr.p_id
                WHERE e.e_activo = true
                  AND e.e_fecha < CURRENT_DATE
                GROUP BY v.evento_id, pr.p_id, pr.p_marca, pr.p_varietal
            )
            SELECT 
                "eventoId",
                producto,
                "unidadesVendidas"
            FROM ranking_vinos
            WHERE rn <= 3
            ORDER BY "eventoId", rn ASC;
        `;
        const resTopVinosEvento = await pool.query(queryTopVinosEvento);

        // 3. Top 3 métodos de pago más utilizados por cada evento pasado y activo
        const queryTopMetodosEvento = `
            WITH ranking_metodos AS (
                SELECT 
                    v.evento_id AS "eventoId",
                    COALESCE(v.v_metodo_pago, 'Sin especificar') AS metodo,
                    COUNT(*) AS cantidad,
                    ROW_NUMBER() OVER (
                        PARTITION BY v.evento_id 
                        ORDER BY COUNT(*) DESC, v.v_metodo_pago ASC
                    ) AS rn
                FROM ventas v
                JOIN eventos e ON v.evento_id = e.e_id
                WHERE e.e_activo = true
                  AND e.e_fecha < CURRENT_DATE
                GROUP BY v.evento_id, v.v_metodo_pago
            )
            SELECT 
                "eventoId",
                metodo,
                cantidad
            FROM ranking_metodos
            WHERE rn <= 3
            ORDER BY "eventoId", rn ASC;
        `;
        const resTopMetodosEvento = await pool.query(queryTopMetodosEvento);

        // Consolidado de estadísticas por evento pasado activo
        const estadisticasPorEvento = resEventosEstadisticas.rows.map(ev => {
            const eventoId = Number(ev.eventoId);

            const topVinos = resTopVinosEvento.rows
                .filter(v => Number(v.eventoId) === eventoId)
                .map(v => ({
                    producto: v.producto,
                    unidadesVendidas: Number(v.unidadesVendidas)
                }));

            const topMetodosPago = resTopMetodosEvento.rows
                .filter(m => Number(m.eventoId) === eventoId)
                .map(m => ({
                    metodo: m.metodo,
                    cantidad: Number(m.cantidad)
                }));

            return {
                eventoId,
                nombre: ev.nombre,
                fecha: ev.fecha,
                cantidadVentas: Number(ev.cantidadVentas),
                totalRecaudado: Number(ev.totalRecaudado),
                topMetodosPago,
                topVinos
            };
        });

        // Consolidado final que se envía al front
        const resumen = {
            totalIngresosMensuales: Number(resIngresos.rows[0].totalIngresosMensuales),
            suscripcionesActivas: Number(resSuscripciones.rows[0].suscripcionesActivas),
            clientesRegistrados: Number(resClientes.rows[0].clientesRegistrados),
            planMasVendido,
            distribucionPorPlan: resDistribucion.rows.map(r => ({
                planId: Number(r.planId),
                nombre: r.nombre,
                cantidadSuscripciones: Number(r.cantidadSuscripciones),
                ingresos: Number(r.ingresos)
            })),
            metodosPagoMasUsados,
            topProductos: resTopProductos.rows.map(p => ({
                producto: p.producto,
                unidadesVendidas: Number(p.unidadesVendidas),
                totalRecaudado: Number(p.totalRecaudado)
            })),
            proximosEventos: resEventos.rows.map(e => ({
                nombre: e.nombre,
                fecha: e.fecha,
                cupos: Number(e.cupos)
            })),
            estadisticasPorEvento
        };

        res.json(resumen);
    } catch (err) {
        next(err);
    }
};