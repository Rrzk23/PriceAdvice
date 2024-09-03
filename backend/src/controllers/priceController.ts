import { Request, Response, NextFunction, RequestHandler } from 'express';
import { FilterSetting } from '../../../shared/types';
import Price from '../../models/priceModel';
import axios from 'axios';
import { z } from 'zod';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// Define a Zod schema for FilterSetting
const FilterSettingSchema = z.object({
  location: z.string(),
  minPrice: z.number(),
  maxPrice: z.number(),
  propertyType: z.string(),
});


export const getFilteredPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: FilterSetting = req.body;
    FilterSettingSchema.parse(filters); // Valititle filter settings

    // Replace with the actual API call and logic to use the filters
    const response = await axios.get('https://example.com/api/prices', {
      params: filters,
    });

    //const prices: Price[] = response.data;
    //PricesArraySchema.parse(prices); // Valititle the response data

    //res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filtered prices', error });
  }
};

export const getPrices : RequestHandler = async (req, res, next) => {
  try {
    //throw Error('Server error');
    const price = await Price.find().exec();
    res.status(200).json(price);
  } catch (error) { 
    //middleware  
    next(error);
  }
  
};
export const getPrice : RequestHandler = async (req, res, next) => {
  const priceId = req.params.priceId;
  try {
    if (!mongoose.isValidObjectId(priceId)) {
      throw createHttpError(400, 'Invalid price id');
    }
    const price = await Price.findById(priceId).exec();
    if (!price) {
      throw createHttpError(404, 'Price not found');
    }
    res.status(200).json(price);
  } catch (error) {
    next(error);
  }
  
};
interface CreatePriceBody {
  location?: string;
  price?: string;
  title?: string;
}
export const postPrice : RequestHandler<unknown, unknown, CreatePriceBody, unknown> = async (req, res, next) => {
  const location = req.body.location;
  const price = req.body.price;
  const title = req.body.title;
  try {
    if (!location || !price || !title) {
      throw createHttpError(400, 'Posting price requires a location, price and title');
    }
    const newPrice = await Price.create({
      location : location,
      price: price,
      title: title,
    });
    //await newPrice.save();
    // new resource created.
    res.status(201).json(newPrice);
  } catch (error) {
    next(error);
  }
};

interface UptitleNoteParams {
  priceId: string;
}

interface UptitlePriceBody {
  location?: string;
  price?: string;
  title?: string;
}
export const updatePrice : RequestHandler<UptitleNoteParams, unknown, UptitlePriceBody, unknown> = async (req, res, next) => {
  const priceId = req.params.priceId;
  const newLocation = req.body.location;
  const newPrice = req.body.price;
  const newtitle = req.body.title;
  try {

    if (!mongoose.isValidObjectId(priceId)) {
      throw createHttpError(400, 'Invalid price id');
    }

    if (!newLocation) {
      throw createHttpError(400, 'Updating price missing a location');
    }
    if (!newPrice) {
      throw createHttpError(400, 'Updating price missing a price');
    }
    if (!newtitle) {
      throw createHttpError(400, 'Updating price missing a title');
    }
    const price = await Price.findById(priceId).exec();
    if (!price) {
      throw createHttpError(404, 'Price not found');
    }
    price.location = newLocation;
    price.price = newPrice;
    price.title = newtitle;
    const uptitledPrice = await price.save();
    res.status(200).json(uptitledPrice);
  } catch (error) {
    next(error);
  }
};
export const deletePrice : RequestHandler = async (req, res, next) => {
  const priceId = req.params.priceId;
  try {
    if (!mongoose.isValidObjectId(priceId)) {
      throw createHttpError(400, 'Invalid price id');
    }
    const price = await Price.findById(priceId).exec();
    if (!price) {
      throw createHttpError(404, 'Price not found');
    }
    await Price.findByIdAndDelete(priceId).exec();

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
