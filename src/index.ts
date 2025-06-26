import dotenv from 'dotenv';
dotenv.config();
import { Hono } from 'hono';
import auth from './routes/auth';
import bookingRoute from './routes/booking';
import paxRoute from './routes/pax';
import paymentRoute from './routes/payment';
import baggageRoute from './routes/baggage';
import { authMiddleware, authorizeRoles } from './middleware/auth';
import './scheduler';
import fs from 'fs';
import path from 'path';
import { format, toZonedTime } from 'date-fns-tz';

const app = new Hono();

app.route('/auth', auth);
app.route('/bookings', bookingRoute);
app.route('/pax', paxRoute);
app.route('/payment', paymentRoute);
app.route('/baggage', baggageRoute);

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

function logToFile(message: string, type: string = 'log') {
  const logDir = path.join(__dirname, '../logs');
  const jakartaTZ = 'Asia/Jakarta';
  const now = new Date();
  const zonedDate = toZonedTime(now, jakartaTZ);
  const dateStr = format(zonedDate, 'yyyy-MM-dd', { timeZone: jakartaTZ });
  const logFile = path.join(logDir, `${dateStr}.log`);
  const logTime = format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: jakartaTZ });
  const logMessage = `[${logTime}] [${type.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
}

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args: any[]) => {
  originalLog(...args);
  logToFile(args.map(String).join(' '), 'log');
};
console.error = (...args: any[]) => {
  originalError(...args);
  logToFile(args.map(String).join(' '), 'error');
};
console.warn = (...args: any[]) => {
  originalWarn(...args);
  logToFile(args.map(String).join(' '), 'warn');
};

console.log('========================================');
const serverMsg = `🚀 Server berjalan di http://localhost:${PORT}`;
console.log(serverMsg);
logToFile(serverMsg);
console.log('========================================');
