import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const adminUser = await clerkClient.users.getUser(userId);
  const adminRole = adminUser.publicMetadata.role as string;

  if (adminRole !== 'ADMIN' && adminRole !== 'DEV') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body = await request.json();
    const { userIdToUpdate, newRole } = body;

    await clerkClient.users.updateUser(userIdToUpdate, {
      publicMetadata: { role: newRole },
    });

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error assigning role:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}