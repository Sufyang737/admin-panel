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
    const personas = await prisma.persona.findMany({
      include: {
        cliente: true,
      },
    });
    return NextResponse.json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
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
    const persona = await prisma.persona.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        telefono: body.telefono,
        email: body.email,
        cumpleanos: body.cumpleanos ? new Date(body.cumpleanos) : null,
        eventoCalendarioId: body.eventoCalendarioId,
        clienteId: body.clienteId,
      },
    });
    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error creating persona:', error);
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
    const persona = await prisma.persona.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        telefono: body.telefono,
        email: body.email,
        cumpleanos: body.cumpleanos ? new Date(body.cumpleanos) : null,
        eventoCalendarioId: body.eventoCalendarioId,
        clienteId: body.clienteId,
      },
    });
    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error updating persona:', error);
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

    await prisma.persona.delete({
      where: { id },
    });
    return new NextResponse('Persona deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting persona:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}