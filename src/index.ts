import { Hono } from 'hono';
import auth from './routes/auth';
import bookingRoute from './routes/booking';
import paxRoute from './routes/pax';
import paymentRoute from './routes/payment';
import { authMiddleware, authorizeRoles } from './middleware/auth';
import './scheduler';

const app = new Hono();

app.route('/auth', auth);
app.route('/booking', bookingRoute);
app.route('/pax', paxRoute);
app.route('/payment', paymentRoute);

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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
serve({ fetch: app.fetch, port: PORT });

console.log('========================================');
console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
console.log('📅 Scheduler aktif, menulis log setiap menit');
console.log('========================================');
