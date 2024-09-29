import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  date
} from 'drizzle-orm/pg-core';

// Enums
export const monedaEnum = pgEnum('moneda', ['USD', 'ARS']);
export const rolEnum = pgEnum('rol', [
  'socia',
  'planner',
  'staff',
  'administrativa'
]);

// Tabla persona
export const persona = pgTable('persona', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  telefono: text('telefono'),
  email: text('email').notNull(),
  cumpleanios: date('cumpleanios'),
  eventoCalendarioId: text('evento_calendario_id'),
  clienteId: integer('cliente_id').references(() => cliente.id, {
    onDelete: 'cascade'
  })
});

// Tabla cliente
export const cliente = pgTable('cliente', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull(),
  ciudadId: integer('ciudad_id').notNull() // assuming you'll add the ciudad table later
});

// Tabla evento
export const evento = pgTable('evento', {
  id: serial('id').primaryKey(),
  fecha: date('fecha').notNull(),
  numInvitados: integer('num_invitados').notNull(),
  clienteId: integer('cliente_id')
    .references(() => cliente.id, { onDelete: 'cascade' })
    .notNull(),
  carpetaId: text('carpeta_id').notNull(),
  estado: text('estado').notNull(),
  plannerId: integer('planner_id').references(() => empleadas.id, {
    onDelete: 'cascade'
  })
});

// Tabla empleadas
export const empleadas = pgTable('empleadas', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono').notNull()
});

// Tabla personal_roles
export const personalRoles = pgTable('personal_roles', {
  id: serial('id').primaryKey(),
  personalId: integer('personal_id')
    .references(() => empleadas.id, { onDelete: 'cascade' })
    .notNull(),
  rol: rolEnum('rol').notNull()
});

// Tabla movimientos
export const movimientos = pgTable('movimientos', {
  id: serial('id').primaryKey(),
  monto: decimal('monto', { precision: 10, scale: 2 }).notNull(),
  moneda: monedaEnum('moneda').notNull(),
  categoriaId: integer('categoria_id')
    .references(() => catMov.id, { onDelete: 'cascade' })
    .notNull(),
  subcategoriaId: integer('subcategoria_id')
    .references(() => subcatMovimiento.id, { onDelete: 'cascade' })
    .notNull(),
  detalleId: integer('detalle_id')
    .references(() => detMov.id, { onDelete: 'cascade' })
    .notNull(),
  ingreso: boolean('ingreso').notNull(),
  fechaProgramado: date('fecha_programado'),
  fechaRecibido: date('fecha_recibido')
});

// Tabla cat_mov
export const catMov = pgTable('cat_mov', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion')
});

// Tabla subcat_movimiento
export const subcatMovimiento = pgTable('subcat_movimiento', {
  id: serial('id').primaryKey(),
  catMovId: integer('cat_mov_id')
    .references(() => catMov.id, { onDelete: 'cascade' })
    .notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion')
});

// Tabla det_mov
export const detMov = pgTable('det_mov', {
  id: serial('id').primaryKey(),
  subcatMovId: integer('subcat_mov_id')
    .references(() => subcatMovimiento.id, { onDelete: 'cascade' })
    .notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion')
});

// Relaciones
export const clienteRelations = relations(cliente, ({ many }) => ({
  personas: many(persona),
  eventos: many(evento)
}));

export const eventoRelations = relations(evento, ({ one }) => ({
  cliente: one(cliente, {
    fields: [evento.clienteId],
    references: [cliente.id]
  }),
  planner: one(empleadas, {
    fields: [evento.plannerId],
    references: [empleadas.id]
  })
}));

export const personalRolesRelations = relations(personalRoles, ({ one }) => ({
  personal: one(empleadas, {
    fields: [personalRoles.personalId],
    references: [empleadas.id]
  })
}));

export const movimientosRelations = relations(movimientos, ({ one }) => ({
  categoria: one(catMov, {
    fields: [movimientos.categoriaId],
    references: [catMov.id]
  }),
  subcategoria: one(subcatMovimiento, {
    fields: [movimientos.subcategoriaId],
    references: [subcatMovimiento.id]
  }),
  detalle: one(detMov, {
    fields: [movimientos.detalleId],
    references: [detMov.id]
  })
}));

export const subcatMovimientoRelations = relations(
  subcatMovimiento,
  ({ one }) => ({
    categoria: one(catMov, {
      fields: [subcatMovimiento.catMovId],
      references: [catMov.id]
    })
  })
);
