const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let server;

beforeAll(async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cipherstudio_test';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(0); // Start the server on a random port for testing
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close(); // Ensure the server is closed after tests
});

describe('Authentication Tests', () => {
  test('Register a new user and receive a token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  test('Login with registered user and receive a token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Prevent access to another user’s project', async () => {
    const user1 = await new User({
      name: 'User One',
      email: 'userone@example.com',
      passwordHash: 'password123',
    }).save();

    const user2 = await new User({
      name: 'User Two',
      email: 'usertwo@example.com',
      passwordHash: 'password123',
    }).save();

    const project = await request(app)
      .post('/api/projects/save')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({
        name: 'User One Project',
        files: [],
      });

    const response = await request(app)
      .get(`/api/projects/${project.body.id}`)
      .set('Authorization', `Bearer ${user2.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Access denied');
  });
});