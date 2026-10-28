process.loadEnvFile();

export const env = {
  PORT: process.env.PORT ?? 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  PGHOST: process.env.PGHOST ?? 'localhost',
  PGPORT: process.env.PGPORT ?? 5432,
  PGUSER: process.env.PGUSER ?? 'postgres',
  PGPASSWORD: process.env.PGPASSWORD ?? 'tutuca1624',
  PGDATABASE: process.env.PGDATABASE ?? 'maria-balbina-lab',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
};

// Si falta el secreto, el servidor no arranca (mejor fallar ahora que firmar tokens inseguros)
if (!env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}
