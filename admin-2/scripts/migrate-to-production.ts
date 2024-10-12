import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function migrateToProduction() {
  try {
    // Ejecutar migraciones de Prisma
    console.log('Ejecutando migraciones de Prisma...');
    await execAsync('npx prisma migrate deploy');

    // Verificar la conexión a la base de datos de producción
    console.log('Verificando conexión a la base de datos de producción...');
    await prisma.$connect();

    // Realizar cualquier tarea adicional necesaria para la migración a producción
    // Por ejemplo, poblar tablas de configuración, crear índices, etc.

    console.log('Migración a producción completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración a producción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToProduction();