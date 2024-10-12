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
    const eventos = await prisma.evento.findMany({
      include: {
        tipoEvento: true,
        cliente: true,
        planner: true,
      },
    });
    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Error fetching eventos:', error);
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
    const evento = await prisma.evento.create({
      data: {
        fecha: new Date(body.fecha),
        numInvitados: body.numInvitados,
        tipoEventoId: body.tipoEventoId,
        clienteId: body.clienteId,
        carpetaId: body.carpetaId,
        estado: body.estado,
        plannerId: body.plannerId,
      },
    });
    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error creating evento:', error);
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
    const evento = await prisma.evento.update({
      where: { id: body.id },
      data: {
        fecha: new Date(body.fecha),
        numInvitados: body.numInvitados,
        tipoEventoId: body.tipoEventoId,
        clienteId: body.clienteId,
        carpetaId: body.carpetaId,
        estado: body.estado,
        plannerId: body.plannerId,
      },
    });
    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error updating evento:', error);
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

    await prisma.evento.delete({
      where: { id },
    });
    return new NextResponse('Evento deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting evento:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}