import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MemoryStore } from 'express-session';
import { describe, expect, beforeAll, afterAll, it } from '@jest/globals';
import app, { setSessionStore, applySessionMiddleware } from '../../src/app';  

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const memoryStore = new MemoryStore();
  setSessionStore(memoryStore);
  applySessionMiddleware(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Authentication and Session Tests', () => {
  let agent: request.SuperTest<request.Test>;
  
  beforeAll(() => {
    agent = request.agent(app) as unknown as request.SuperAgentTest;
  });
  afterAll(async () => {
    // Clear the database after each test
    await mongoose.connection.dropDatabase();
  });

  it('should sign up a user and maintain session', async () => {
    const signupResponse = await agent
      .post('/api/auth/signup')
      .send({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123',
      });

    expect(signupResponse.status).toBe(201);

    
  });

  it('should login a user and maintain session', async () => {
    // First, create a user
    const signupResponse = await agent
      .post('/api/auth/signup')
      .send({
        username: 'loginuser',
        email: 'loginuser@example.com',
        password: 'password123',
      });
    
    expect(signupResponse.status).toBe(201);

    // Now, login
    const loginResponse = await agent
      .post('/api/auth/login')
      .send({
        userNameOrEmail: 'loginuser',
        password: 'password123',
      });

    expect(loginResponse.status).toBe(201);

    const user = await agent
      .get('/api/auth/');
    
    expect(user.status).toBe(200);
  });

});