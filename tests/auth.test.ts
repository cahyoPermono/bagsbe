import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Hono } from 'hono';
import auth from '../src/routes/auth';
import supertest from 'supertest';
import { db } from '../src/db';
import { users } from '../src/models/user';
import { eq } from 'drizzle-orm';

let server: any;
let request: any;

const testUser = { username: 'testuser', password: 'testpassword' };

beforeAll(async () => {
  // Clean up test user if exists
  await db.delete(users).where(eq(users.username, testUser.username));
  const app = new Hono();
  app.route('/auth', auth);
  server = app.fetch; // Use fetch handler for supertest
  request = supertest((req, res) => {
    const url = req.url || '/';
    const method = req.method;
    const headers = req.headers;
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      const response = await server(
        new Request(`http://localhost${url}`, {
          method,
          headers,
          body: body.length > 0 ? body : undefined,
        })
      );
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
    });
  });
});

afterAll(async () => {
  await db.delete(users).where(eq(users.username, testUser.username));
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request.post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testUser));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId');
  });

  it('should not register duplicate user', async () => {
    const res = await request.post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testUser));
    expect(res.status).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request.post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testUser));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request.post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ ...testUser, password: 'wrong' }));
    expect(res.status).toBe(401);
  });
});
