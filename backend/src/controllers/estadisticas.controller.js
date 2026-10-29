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

        //Suscripciones activas
        const querySuscripciones = `
            SELECT COUNT(*) AS "suscripcionesActivas" 
            FROM suscripcion;
        `;
        const resSuscripciones = await pool.query(querySuscripciones);

        //Clientes registrados
        const queryClientes = `
            SELECT COUNT(*) AS "clientesRegistrados" 
            FROM personas 
            WHERE pe_rol = 'cliente';
        `;
        const resClientes = await pool.query(queryClientes);

        //Distribución por plan e ingresos asociados
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

        //Métodos de pago más usados
        const queryMetodosPago = `
            SELECT 
                v_metodo_pago AS metodo,
                COUNT(*) AS cantidad
            FROM ventas
            GROUP BY v_metodo_pago
            ORDER BY cantidad DESC;
        `;
        const resMetodos = await pool.query(queryMetodosPago);

        const totalVentasCount = resMetodos.rows.reduce((acc, curr) => acc + Number(curr.cantidad), 0);
        
        const metodosPagoMasUsados = resMetodos.rows.map(row => {
            const cantidad = Number(row.cantidad);
            const porcentaje = totalVentasCount > 0 ? Number(((cantidad / totalVentasCount) * 100).toFixed(1)) : 0;
            return {
                metodo: row.metodo || 'Sin especificar',
                cantidad,
                porcentaje
            };
        });

        // Top Productos más vendidos (Agregado para solucionar el faltante)
        const queryTopProductos = `
            SELECT 
                pr.p_marca || ' ' || pr.p_varietal AS producto,
                SUM(rv.iv_cantidad) AS "unidadesVendidas",
                SUM(rv.iv_cantidad * rv.iv_precio_unidad) AS "totalRecaudado"
            FROM reglones_venta rv
            JOIN productos pr ON rv.producto_codigo = pr.p_id
            GROUP BY pr.p_id, pr.p_marca, pr.p_varietal
            ORDER BY "unidadesVendidas" DESC
            LIMIT 5;
        `;
        const resTopProductos = await pool.query(queryTopProductos);

        // Próximos eventos
        const queryEventos = `
            SELECT 
                e_nombre AS nombre,
                e_fecha AS fecha,
                e_cant_asist AS cupos
            FROM eventos
            WHERE e_fecha >= CURRENT_DATE
            ORDER BY e_fecha ASC
            LIMIT 3;
        `;
        const resEventos = await pool.query(queryEventos);

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
            }))
        };

        res.json(resumen);
    } catch (err) {
        next(err);
    }
};