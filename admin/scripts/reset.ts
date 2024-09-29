import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from '../db/schema'; // Asegúrate de que el schema esté bien importado

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log('Resetting the database');

    // Borrar los datos de las tablas en el orden correcto para evitar problemas de dependencias
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);
    await db.delete(schema.courses);

    console.log('Resetting finished');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to reset the database');
  }
};

main();
