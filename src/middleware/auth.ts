import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

declare module 'hono' {
  interface ContextVariableMap {
    user: { id: number; role: string; [key: string]: any };
  }
}

const JWT_SECRET = 'your_jwt_secret'; // In production, use environment variables

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export function authorizeRoles(allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as { role?: string };
    if (!user || !allowedRoles.includes(user.role || '')) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}
