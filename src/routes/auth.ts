import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../models/_schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Use environment variables in production

const auth = new Hono();

auth.post('/register', async (c) => {
  const { username, password, role } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existingUser.length > 0) {
    return c.json({ error: 'Username already exists' }, 409);
  }

  const userRole = role || 'user';

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.insert(users).values({ username, password: hashedPassword, role: userRole }).returning();

  return c.json({ message: 'User registered successfully', userId: result[0].id });
});

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (user.length === 0) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const token = jwt.sign({ id: user[0].id, username: user[0].username, role: user[0].role }, JWT_SECRET, { expiresIn: '1h' });
  return c.json({ token });
});

export default auth;
