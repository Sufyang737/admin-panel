import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
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
    const users = await clerkClient.users.getUserList();
    const simplifiedUsers = users.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata.role || 'DEFAULT',
    }));
    return NextResponse.json(simplifiedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}