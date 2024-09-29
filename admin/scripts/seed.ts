import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Importa el esquema actualizado
import * as schema from '../db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log('Poblando la base de datos');

    // Borrar datos existentes
    await db.delete(schema.persona);
    await db.delete(schema.cliente);
    await db.delete(schema.evento);
    await db.delete(schema.empleadas);
    await db.delete(schema.personalRoles);
    await db.delete(schema.movimientos);
    await db.delete(schema.catMov);
    await db.delete(schema.subcatMovimiento);
    await db.delete(schema.detMov);

    // Insertar personas
    await db.insert(schema.persona).values([
      {
        id: 1,
        nombre: 'Carlos',
        apellido: 'Pérez',
        telefono: '555-1234',
        email: 'carlos.perez@example.com',
        cumpleanios: new Date('1985-06-15'),
        clienteId: 1 // Verifica si `clienteId` es el campo correcto
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        telefono: '555-5678',
        email: 'maria.gonzalez@example.com',
        cumpleanios: new Date('1990-12-22'),
        clienteId: 2
      }
    ]);

    // Insertar clientes
    await db.insert(schema.cliente).values([
      {
        id: 1,
        nombre: 'Empresa X',
        email: 'contacto@empresax.com',
        ciudadId: 1 // Verifica si `ciudadId` sigue siendo correcto
      },
      {
        id: 2,
        nombre: 'Empresa Y',
        email: 'info@empresay.com',
        ciudadId: 2
      }
    ]);

    // Insertar eventos
    await db.insert(schema.evento).values([
      {
        id: 1,
        fecha: new Date('2023-10-15'),
        numInvitados: 100,
        clienteId: 1, // Asegúrate que la relación `clienteId` esté bien definida
        carpetaId: 'CARP_123', // Campo único?
        estado: 'pendiente',
        plannerId: 1 // Verifica si `plannerId` sigue siendo correcto
      },
      {
        id: 2,
        fecha: new Date('2023-11-20'),
        numInvitados: 50,
        clienteId: 2,
        carpetaId: 'CARP_456',
        estado: 'confirmado',
        plannerId: 2
      }
    ]);

    // Insertar empleadas
    await db.insert(schema.empleadas).values([
      {
        id: 1,
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@example.com',
        telefono: '555-9876'
      },
      {
        id: 2,
        nombre: 'Luis',
        apellido: 'Martínez',
        email: 'luis.martinez@example.com',
        telefono: '555-6543'
      }
    ]);

    // Insertar roles de personal
    await db.insert(schema.personalRoles).values([
      {
        id: 1,
        personalId: 1, // Campo correcto para la relación?
        rol: 'planner'
      },
      {
        id: 2,
        personalId: 2,
        rol: 'staff'
      }
    ]);

    // Insertar categorías de movimientos
    await db.insert(schema.catMov).values([
      {
        id: 1,
        nombre: 'Ingresos',
        descripcion: 'Dinero recibido'
      },
      {
        id: 2,
        nombre: 'Gastos',
        descripcion: 'Dinero gastado'
      }
    ]);

    // Insertar subcategorías de movimientos
    await db.insert(schema.subcatMovimiento).values([
      {
        id: 1,
        catMovId: 1, // Verifica si `catMovId` sigue siendo correcto
        nombre: 'Ventas',
        descripcion: 'Ingresos por ventas'
      },
      {
        id: 2,
        catMovId: 2,
        nombre: 'Compras',
        descripcion: 'Gastos por compras'
      }
    ]);

    // Insertar detalles de movimientos
    await db.insert(schema.detMov).values([
      {
        id: 1,
        subcatMovId: 1, // Verifica la relación con `subcatMovimiento`
        nombre: 'Venta de producto A',
        descripcion: 'Ingreso por la venta de producto A'
      },
      {
        id: 2,
        subcatMovId: 2,
        nombre: 'Compra de suministros',
        descripcion: 'Gasto en la compra de suministros'
      }
    ]);

    // Insertar movimientos
    await db.insert(schema.movimientos).values([
      {
        id: 1,
        monto: 5000.0,
        moneda: 'USD',
        categoriaId: 1, // Verifica el campo `categoriaId`
        subcategoriaId: 1, // Verifica si la relación está correcta
        detalleId: 1,
        ingreso: true,
        fechaProgramado: new Date('2023-10-01'),
        fechaRecibido: new Date('2023-10-02')
      },
      {
        id: 2,
        monto: 300.0,
        moneda: 'USD',
        categoriaId: 2,
        subcategoriaId: 2,
        detalleId: 2,
        ingreso: false,
        fechaProgramado: new Date('2023-10-05'),
        fechaRecibido: new Date('2023-10-06')
      }
    ]);

    console.log('Población de base de datos finalizada');
  } catch (error) {
    console.error(error);
    throw new Error('Error al poblar la base de datos');
  }
};

main();
