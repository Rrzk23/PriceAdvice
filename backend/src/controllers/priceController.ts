import { Request, Response, NextFunction } from 'express';
import { Price, FilterSetting } from '../../../shared/types';
import axios from 'axios';
import { z } from 'zod';

// Define a Zod schema for FilterSetting
const FilterSettingSchema = z.object({
  location: z.string(),
  minPrice: z.number(),
  maxPrice: z.number(),
  propertyType: z.string(),
});

// Define a Zod schema for Price
const PriceSchema = z.object({
  id: z.string(),
  location: z.string(),
  price: z.number(),
  date: z.string(),
});

const PricesArraySchema = z.array(PriceSchema);

// Controller function to get filtered prices
export const getFilteredPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: FilterSetting = req.body;
    FilterSettingSchema.parse(filters); // Validate filter settings

    // Replace with the actual API call and logic to use the filters
    const response = await axios.get('https://example.com/api/prices', {
      params: filters,
    });

    const prices: Price[] = response.data;
    PricesArraySchema.parse(prices); // Validate the response data

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filtered prices', error });
  }
};
export const getRealTimePrices = async (req: Request, res: Response): Promise<void> => {
};
