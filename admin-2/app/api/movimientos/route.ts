import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const movimientos = await prisma.movimiento.findMany({
      include: {
        categoria: true,
        subcategoria: true,
        detalle: true,
      },
    });
    return NextResponse.json(movimientos);
  } catch (error) {
    console.error('Error fetching movimientos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const movimiento = await prisma.movimiento.create({
      data: {
        monto: body.monto,
        moneda: body.moneda,
        categoriaId: body.categoriaId,
        subcategoriaId: body.subcategoriaId,
        detalleId: body.detalleId,
        ingreso: body.ingreso,
        fechaProgramado: new Date(body.fechaProgramado),
        fechaRecibido: body.fechaRecibido ? new Date(body.fechaRecibido) : null,
      },
    });
    return NextResponse.json(movimiento);
  } catch (error) {
    console.error('Error creating movimiento:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const movimiento = await prisma.movimiento.update({
      where: { id: body.id },
      data: {
        monto: body.monto,
        moneda: body.moneda,
        categoriaId: body.categoriaId,
        subcategoriaId: body.subcategoriaId,
        detalleId: body.detalleId,
        ingreso: body.ingreso,
        fechaProgramado: new Date(body.fechaProgramado),
        fechaRecibido: body.fechaRecibido ? new Date(body.fechaRecibido) : null,
      },
    });
    return NextResponse.json(movimiento);
  } catch (error) {
    console.error('Error updating movimiento:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse('Missing id parameter', { status: 400 });
    }

    await prisma.movimiento.delete({
      where: { id },
    });
    return new NextResponse('Movimiento deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting movimiento:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}