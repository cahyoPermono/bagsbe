import { Hono } from 'hono';
import auth from './routes/auth';
import { authMiddleware, authorizeRoles } from './middleware/auth';

const app = new Hono();

app.route('/auth', auth);

app.get('/protected', authMiddleware, (c) => {
  // @ts-ignore
  const user = c.get('user');
  return c.json({ message: 'This is a protected route', user });
});

// Admin-only route example
app.get('/admin', authMiddleware, authorizeRoles(['admin']), (c) => {
  return c.json({ message: 'Welcome, admin!' });
});

app.get('/', (c) => c.text('Hello from Hono backend with Drizzle ORM!'));

import { serve } from '@hono/node-server';

serve(app);
