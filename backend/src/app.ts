/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import express, { Application, NextFunction, Request, Response } from 'express';
import 'dotenv/config.js';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import priceRoutes from './routes/priceRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import priceProcess from './priceProcessing';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import env from './utils/validateEnv';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { requireAuth } from './middleware/auth';

// Initialize environment variables


// Create an Express application
const app: Application = express();
app.use(express.json());
let sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.DB_URL,
  }),
});

export function setSessionStore(store: session.Store) {
  sessionMiddleware = session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: store,
  });
}

// Use a function to apply session middleware
export function applySessionMiddleware(app2: express.Application) {
  app2.use(sessionMiddleware);
}

// Apply the session middleware
applySessionMiddleware(app);


app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge : 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create( {
    mongoUrl: env.DB_URL,

  },
  ),
}),
);
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  },
));
app.use(morgan('dev'));

// Load environment variables
const RapidAPIKey: string = env.RAPIDAPI_KEY;

app.use('/api/auth', authRoutes);
app.use('/api/prices', requireAuth, priceRoutes);

app.use('/api/', requireAuth, userRoutes);

// For unidentified endpoints
app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = 'an unknown error occurred';
  let statuscode = 500;
  if (isHttpError(error)) {
    statuscode = error.status;
    errorMessage = error.message;
  }
  //console.error('Test Error:', error);
  res.status(statuscode).json({ error: errorMessage });
});

app.post('/hi', (req, res) => {
  const { state, suburb, zip, bedrooms, bathrooms, garage, priceMin, priceMax, areaMin, areaMax } = req.body;
  console.log('Hello, we get ' + state);
  res.send(JSON.stringify(req.body));
});

app.get('/list', async (req, res) => {
  const query = req.query;
  const suggesstions = {
    method: 'GET',
    url: 'https://realty-in-au.p.rapidapi.com/auto-complete',
    params: { query: query },
    headers: {
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com',
    },
  };
  let searchLocation: string | undefined;
  let searchLocationSubtext: string | undefined;
  let type: string | undefined;
  try {
    const response = await axios.request(suggesstions);
    const suggesstion = response.data.suggesstions[0];
    searchLocation = suggesstion.display.text;
    searchLocationSubtext = suggesstion.display.subtext;
    type = suggesstion.type;
  } catch (error) {
    console.error(error);
  }
  const channel: string | undefined = req.query.channel as string;
  const sort: string | undefined = req.query.sort as string;
  const options = {
    method: 'GET',
    url: 'https://realty-in-au.p.rapidapi.com/properties/list',
    params: {
      channel: channel || 'buy',
      searchLocation: searchLocation,
      searchLocationSubtext: searchLocationSubtext,
      type: type,
      page: '1',
      pageSize: '50',
      sortType: sort || 'relevance',
      surroundingSuburbs: 'true',
      'ex-under-contract': 'false',
    },
    headers: {
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const results = response.data.tieredResults[0].results;
    const prices = results.map((result: any) => ({
      address: `${result.address.streetAddress} ${result.address.suburb} ${result.address.postcode}`,
      price: priceProcess(result.price.display),
    }));
    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

export default app;
