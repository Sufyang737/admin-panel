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
    const clientes = await prisma.cliente.findMany({
      include: {
        ciudad: true,
        personas: true,
        eventos: true,
      },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
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
    const cliente = await prisma.cliente.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        ciudadId: body.ciudadId,
      },
    });
    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error creating cliente:', error);
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
    const cliente = await prisma.cliente.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        email: body.email,
        ciudadId: body.ciudadId,
      },
    });
    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error updating cliente:', error);
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

    await prisma.cliente.delete({
      where: { id },
    });
    return new NextResponse('Cliente deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting cliente:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}