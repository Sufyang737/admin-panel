import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: '/db/schema', // Mantén la ruta de tu esquema
  out: './drizzle', // Cambia a una carpeta 'drizzle' en la raíz
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL! // Asegúrate de que DATABASE_URL esté configurado correctamente
  }
};

export default config;
