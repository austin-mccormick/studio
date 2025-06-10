
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';

const dailyScrumSchema = z.object({
  yesterday: z.string().min(1, { message: "Yesterday's update cannot be empty" }),
  today: z.string().min(1, { message: "Today's plan cannot be empty" }),
  impediments: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  const userId = decodedToken.userId;

  try {
    const body = await request.json();
    const validation = dailyScrumSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { yesterday, today, impediments } = validation.data;
    const todayDate = new Date();
    const dateStart = startOfDay(todayDate);
    
    // Check if a log already exists for this user for today
    const existingLog = await prisma.dailyScrumLog.findFirst({
      where: {
        userId,
        date: {
          gte: dateStart,
          lt: endOfDay(todayDate),
        },
      },
    });

    if (existingLog) {
      return NextResponse.json({ error: 'A daily scrum log for today has already been submitted.' }, { status: 409 });
    }

    const newLog = await prisma.dailyScrumLog.create({
      data: {
        userId,
        date: dateStart, // Store as the start of the day for consistency
        yesterday,
        today,
        impediments: impediments || '',
      },
    });

    return NextResponse.json({ message: 'Daily scrum log submitted successfully', log: newLog }, { status: 201 });

  } catch (error) {
    console.error('Error submitting daily scrum log:', error);
    if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid input provided.', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
