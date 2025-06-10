
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User as PrismaUser, Role } from '@prisma/client';

export interface UserForClient extends Omit<PrismaUser, 'passwordHash'> {
  // Add any additional properties you want to send to the client
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-super-secret-key-for-dev';
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-fallback-super-secret-key-for-dev') {
  console.warn(
    'WARNING: JWT_SECRET is using a default insecure value in production. Please set a strong secret in your environment variables.'
  );
}
const JWT_EXPIRES_IN = '1d'; // Token expires in 1 day

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: Pick<PrismaUser, 'id' | 'email' | 'role'>): string {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): { userId: string; email: string; role: Role; iat: number; exp: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: Role; iat: number; exp: number };
  } catch (error) {
    return null;
  }
}

export function sanitizeUser(user: PrismaUser): UserForClient {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export { type Role };
