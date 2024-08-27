
import express, { Application } from 'express';

import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import priceRoutes from './routes/priceRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import priceProcess from './priceProcessing';

// Initialize environment variables
dotenv.config();

// Create an Express application
const app: Application = express();

// Load environment variables
const RapidAPIKey: string | undefined = process.env.RAPIDAPI_KEY;
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Apply middleware

app.use(express.json());




//const corsOptions = {
//  origin: 'http://localhost:3000',  // 只允许这个来源的请求
//  optionsSuccessStatus: 200
//};
  
//app.use(cors(corsOptions));
app.use(express.json());

app.post('/hi', (req, res) => {
  const { state, suburb, zip, bedrooms, bathrooms, garage, priceMin, priceMax, areaMin, areaMax } = req.body;
  console.log('Hello, we get ' + state);
  res.send(JSON.stringify(req.body));
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// channel REQUIRED One of the following : buy|rent|sold
//searchLocation REQUIRED The value of text field returned in …/auto-complete endpoint
// searchLocationSubtext The value of subtext field returned in …/auto-complete endpoint
// type REQUIRED The value of region field returned in …/auto-complete endpoint
// sort One of the following relevance|new-asc|new-desc|price-asc|price-desc

// propertyTypes Ignore or one of the following : townhouse|unit apartment|retire|acreage|land|unitblock|house|villa|rural. Separated by comma for multiple options. Ex : townhouse,house,villa
app.get('/list', async (req, res) => {
  console.log(req);
  res.send('Hello there, ' + req);
    
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
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  const channel: string | undefined = req.query.channel as string;
  const sort: string | undefined = req.query.sort as string;
  const options = {
    method: 'GET',
    url: 'https://realty-in-au.p.rapidapi.com/properties/list',
    params: {
      channel: 'buy',
      searchLocation: searchLocation,
      searchLocationSubtext: searchLocationSubtext,
      type: type,
      page: '1',
      pageSize: '50',
      sortType: 'relevance',
      surroundingSuburbs: 'true',
      'ex-under-contract': 'false',
    },
    headers: {
      // Use the corrected variable name here
      'X-RapidAPI-Key': RapidAPIKey, 
      'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log('Start');
    const results = response.data.tieredResults[0].results;
        
    
    const prices = results.map((result: any) => ({
      address: `${result.address.streetAddress} ${result.address.suburb} ${result.address.postcode}`,
      price: priceProcess(result.price.display),
    }));
    console.log(prices);
    console.log('end');
  } catch (error) {
    console.error(error);
  }
},
);
app.use('/api/prices', priceRoutes);
app.use('/api/login', authRoutes);
app.use('/api/', userRoutes);