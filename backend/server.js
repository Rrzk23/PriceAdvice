const rateLimit = require("express-rate-limit");
require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const RapidAPIKey = process.env.RAPIDAPI_KEY;
const PORT = process.env.PORT || 5000;

app.get('/hi', (req, res) => {
    const name = req.query.name;
    res.send('Hello world, ' + name);
})
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


app.get('/list', async (req, res) => {
    const { channel, searchLocation, searchLocationSubtext, type, sort } = req.query;
    const options = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/properties/list',
        params: {
            channel: channel,
            searchLocation: 'Melbourne City - Greater Region, VIC',
            searchLocationSubtext: 'Region',
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
            price['price'] = result.price;
            prices.push(price);
            console.log(i++);
        }
        console.log(prices);
        console.log('end');
    } catch (error) {
        console.error(error);
    }
    }
)
