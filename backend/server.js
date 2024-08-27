
import priceRoutes from './routes/priceRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
const rateLimit = require("express-rate-limit");
require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const RapidAPIKey = process.env.RAPIDAPI_KEY;
const PORT = process.env.PORT || 5000;
const priceProcess = require('./src/priceProcessing');
const cors = require('cors');



const corsOptions = {
    origin: 'http://localhost:3000',  // 只允许这个来源的请求
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

app.post('/hi', (req, res) => {
    const {state, suburb, zip, bedrooms, bathrooms, garage, priceMin, priceMax, areaMin, areaMax} = req.body;
    console.log("Hello, we get " + state);
    res.send(JSON.stringify(req.body));
})
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
    console.log(req)
    res.send('Hello there, ' + req);
    
    const query = req.query;
    const suggesstions = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/auto-complete',
        params: {query: query},
        headers: {
          'X-RapidAPI-Key': RapidAPIKey,
          'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com'
        }
      };
    const {searchLocation, searchLocationSubtext, type} = null;
      try {
          const response = await axios.request(suggesstions);
          const suggesstion = response.suggesstions[0];
          searchLocation = suggesstion.display.text;
          searchLocationSubtext = suggesstion.display.subtext;
          type = suggesstion.type;
          console.log(response.data);
      } catch (error) {
          console.error(error);
      }
    const { channel, sort } = req.query;
    const options = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/properties/list',
        params: {
            channel: buy,
            searchLocation: searchLocation,
            searchLocationSubtext: searchLocationSubtext,
            type: type,
            page: '1',
            pageSize: '50',
            sortType: 'relevance',
            surroundingSuburbs: 'true',
            'ex-under-contract': 'false'
        },
        headers: {
            // Use the corrected variable name here
            'X-RapidAPI-Key': RapidAPIKey, 
            'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Start');
        const results = response.data.tieredResults[0].results;
        const prices = [];
        let i = 1
        for (const result of results) {
            let address = result.address.streetAddress + ' '
            + result.address.suburb + ' ' + result.address.postcode;
            let price = {};
            price['address'] = address;
            price['price'] = priceProcess(result.price.display);
            prices.push(price);
            //console.log(i++);
        }
        console.log(prices);
        console.log('end');
    } catch (error) {
        console.error(error);
    }
    }
)
app.use('/api/prices', priceRoutes);
app.use('/api/login', authRoutes);
app.use('/api/', userRoutes);