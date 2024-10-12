import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // Eliminar todos los registros de todas las tablas
    await prisma.movimiento.deleteMany();
    await prisma.detMov.deleteMany();
    await prisma.subcatMovimiento.deleteMany();
    await prisma.catMov.deleteMany();
    await prisma.evento.deleteMany();
    await prisma.tipoEvento.deleteMany();
    await prisma.empleadaRol.deleteMany();
    await prisma.empleada.deleteMany();
    await prisma.persona.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.ciudad.deleteMany();
    await prisma.user.deleteMany();

    console.log('Base de datos reseteada exitosamente');
  } catch (error) {
    console.error('Error al resetear la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();