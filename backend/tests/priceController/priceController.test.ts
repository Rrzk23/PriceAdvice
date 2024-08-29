import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app';

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Unit Tests for POST /prices/post and DELETE /prices/deleteprice/priceId', () => {
  it('should throw error of Posting price requires a location, price and date', async () => {
    const response = await request(app)
      .post('/api/prices/post')
      .send({
        location: 'Eastwood',
        price: '',
        date: '',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Posting price requires a location, price and date');
  });
  it('should post a valid price and able to delete it, if the id is wrong it should return 400 or 404', async () => {
    const response = await request(app)
      .post('/api/prices/post')
      .send({
        location: 'Eastwood',
        price: '100',
        date: new Date(),
      });
    expect(response.status).toBe(201);
    expect(response.body.location).toBe('Eastwood');
    expect(response.body.price).toBe('100');
    const testId = response.body._id;
    const invalid = new mongoose.Types.ObjectId().toString();

    const deleteResponse = await request(app).delete('/api/prices/deleteprice/' + 'abc');
    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body.error).toBe('Invalid price id');

    const deleteResponse2 = await request(app).delete('/api/prices/deleteprice/' + invalid);
    expect(deleteResponse2.status).toBe(404);
    expect(deleteResponse2.body.error).toBe('Price not found');

    const deleteResponse3 = await request(app).delete('/api/prices/deleteprice/' + testId);
    expect(deleteResponse3.status).toBe(200);
  

  });
});

describe('Unit Tests for GET /prices/getprice/:priceId', () => {
  let testPriceId: string;
  beforeAll(async () => {
    // Seed the database with a test document
    const response = await request(app)
      .post('/api/prices/post') 
      .send({ location: 'Eastwood', price: '100', date: new Date() });
    testPriceId = response.body._id;
  });
  afterAll(async () => {
    // Delete the test document after tests
    await request(app).delete('/api/prices/deleteprice' + testPriceId);
  });
  it('shoult throws error 400 of invalid id for getting price', async () => {
    const response = await request(app)
      .get('/api/prices/getprice/abc');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid price id');
  });
  it('should return 404 for a non-existent price ID', async () => {
    // Using a random or invalid ObjectId
    const invalidId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get('/api/prices/getprice/' + invalidId);
      
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Price not found'); 
  });
  it('should return 200 and get the correct price with the id', async () => {
    const response = await request(app)
      .get('/api/prices/getprice/' + testPriceId);
      
    expect(response.status).toBe(200);
    expect(response.body.location).toBe('Eastwood');
    expect(response.body.price).toBe('100');
    //expect(Date.parse(response.body.date)).toBeInstanceOf(Date);
  });
});


