
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, sanitizeUser, type Role } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.nativeEnum(Role).optional().default('WEB_DEVELOPER'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    return NextResponse.json({ message: 'User registered successfully', user: sanitizeUser(newUser) }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Differentiate between known errors and unexpected ones
    if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid input provided.', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}
