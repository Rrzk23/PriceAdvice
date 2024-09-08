import { RequestHandler } from 'express';
import Price from '../../models/priceModel';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/asserIsDefined';



/*export const getFilteredPrices = async (req: Request, res: Response): Promise<void> => {
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
};*/

export const getPrices : RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);
    
    //throw Error('Server error');
    const price = await Price.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(price);
  } catch (error) { 
    //middleware  
    next(error);
  }
  
};
export const getPrice : RequestHandler = async (req, res, next) => {
  const priceId = req.params.priceId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(priceId)) {
      throw createHttpError(400, 'Invalid price id');
    }
    const price = await Price.findById(priceId).exec();
    if (!price) {
      throw createHttpError(404, 'Price not found');
    }
    if (!price.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'User not authorized');
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
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!location || !price || !title) {
      throw createHttpError(400, 'Posting price requires a location, price and title');
    }
    const newPrice = await Price.create({
      userId : authenticatedUserId,
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
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
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
    if (!price.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'User not authorized');
    }
    const uptitledPrice = await price.save();
    res.status(200).json(uptitledPrice);
  } catch (error) {
    next(error);
  }
};
export const deletePrice : RequestHandler = async (req, res, next) => {
  const priceId = req.params.priceId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(priceId)) {
      throw createHttpError(400, 'Invalid price id');
    }
    const price = await Price.findById(priceId).exec();
    if (!price) {
      throw createHttpError(404, 'Price not found');
    }
    if (!price.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'User not authorized');
    }
    await Price.findByIdAndDelete(priceId).exec();

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
