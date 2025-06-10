
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeUser, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    // Fallback to checking cookies if no Authorization header
    token = request.cookies.get('token')?.value ?? null;
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    // Clear invalid cookie if present
    const response = NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    response.cookies.delete('token');
    return response;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user) {
      // This case might happen if user was deleted after token was issued
      const response = NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Error fetching user for /me route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
