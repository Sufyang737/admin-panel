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
    const empleados = await prisma.empleada.findMany({
      include: {
        roles: true,
        eventos: true,
      },
    });
    return NextResponse.json(empleados);
  } catch (error) {
    console.error('Error fetching empleados:', error);
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
    const empleado = await prisma.empleada.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        email: body.email,
        telefono: body.telefono,
        roles: {
          create: body.roles.map((rol: string) => ({ rol })),
        },
      },
    });
    return NextResponse.json(empleado);
  } catch (error) {
    console.error('Error creating empleado:', error);
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
    const empleado = await prisma.empleada.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        email: body.email,
        telefono: body.telefono,
        roles: {
          deleteMany: {},
          create: body.roles.map((rol: string) => ({ rol })),
        },
      },
    });
    return NextResponse.json(empleado);
  } catch (error) {
    console.error('Error updating empleado:', error);
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

    await prisma.empleada.delete({
      where: { id },
    });
    return new NextResponse('Empleado deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting empleado:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}