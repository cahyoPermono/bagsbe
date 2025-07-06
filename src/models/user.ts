import { db } from '../db';
import { users } from './_schema';
import { eq } from 'drizzle-orm';

export async function getUserByUsername(username: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function createUser(username: string, passwordHash: string, role: string) {
  const [newUser] = await db.insert(users).values({ username, password: passwordHash, role }).returning();
  return newUser;
}
