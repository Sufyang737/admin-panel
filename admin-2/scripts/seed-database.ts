import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Crear ciudades
    const buenosAires = await prisma.ciudad.create({ data: { nombre: 'Buenos Aires' } });
    const cordoba = await prisma.ciudad.create({ data: { nombre: 'Córdoba' } });

    // Crear clientes
    const cliente1 = await prisma.cliente.create({
      data: {
        nombre: 'Cliente Ejemplo 1',
        email: 'cliente1@example.com',
        ciudadId: buenosAires.id,
      },
    });

    // Crear personas
    await prisma.persona.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1234567890',
        email: 'juan@example.com',
        clienteId: cliente1.id,
      },
    });

    // Crear empleados
    const empleado1 = await prisma.empleada.create({
      data: {
        nombre: 'María',
        apellido: 'González',
        dni: '12345678',
        email: 'maria@example.com',
        telefono: '0987654321',
      },
    });

    // Asignar roles a empleados
    await prisma.empleadaRol.create({
      data: {
        empleadaId: empleado1.id,
        rol: 'PLANNER',
      },
    });

    // Crear tipos de evento
    const boda = await prisma.tipoEvento.create({ data: { nombre: 'Boda' } });

    // Crear eventos
    await prisma.evento.create({
      data: {
        fecha: new Date(),
        numInvitados: 100,
        tipoEventoId: boda.id,
        clienteId: cliente1.id,
        estado: 'Planificación',
        plannerId: empleado1.id,
      },
    });

    // Crear categorías de movimientos
    const ingreso = await prisma.catMov.create({ data: { nombre: 'Ingreso' } });

    // Crear subcategorías de movimientos
    const anticipo = await prisma.subcatMovimiento.create({
      data: {
        nombre: 'Anticipo',
        catMovId: ingreso.id,
      },
    });

    // Crear detalles de movimientos
    const detalle = await prisma.detMov.create({
      data: {
        nombre: 'Pago inicial',
        subcatMovimientoId: anticipo.id,
      },
    });

    // Crear movimientos
    await prisma.movimiento.create({
      data: {
        monto: 1000,
        moneda: 'USD',
        categoriaId: ingreso.id,
        subcategoriaId: anticipo.id,
        detalleId: detalle.id,
        ingreso: true,
        fechaProgramado: new Date(),
        fechaRecibido: new Date(),
      },
    });

    console.log('Base de datos poblada exitosamente');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();