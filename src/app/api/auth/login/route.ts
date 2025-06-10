
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePasswords, generateToken, sanitizeUser } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await comparePasswords(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken(user);
    const sanitizedUser = sanitizeUser(user);

    const response = NextResponse.json({ 
      message: 'Login successful', 
      user: sanitizedUser,
      token 
    });

    // Set token in an HTTP-Only cookie for web clients
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
     if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid input provided.', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
