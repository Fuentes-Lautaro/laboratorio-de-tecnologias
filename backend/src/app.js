import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js'
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import productosRoutes from './routes/productos.routes.js';
import authRoutes from './routes/auth.routes.js';
import planesRoutes from './routes/planes.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import personasRoutes from './routes/personas.routes.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/personas', personasRoutes);


// Primero la ruta 404 (Pagina no encontrada), después el manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
