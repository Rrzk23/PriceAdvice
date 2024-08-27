import axios, { AxiosInstance } from 'axios';
import {Price, User, Credentials, FilterSetting} from "../../../shared/types.ts";



const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });


  export const getRealTimePrices = async (): Promise<Price[]> => {
    try {
      const response = await api.get('/prices/realtime');
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
      throw error;
    }
  };
  
  // Function to get historical housing and rental prices
  export const getHistoricalPrices = async (): Promise<Price[]> => {
    try {
      const response = await api.get('/prices/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw error;
    }
  };

  export const registerUser = async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  export const loginUser = async (credentials: Credentials): Promise<User> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  };

  export const getUserProfile = async (token: string): Promise<User> => {
    try {
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  export const getFilteredPrices = async (filters: FilterSetting): Promise<Price[]> => {
    try {
      const response = await api.post('/prices/filter', filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered prices:', error);
      throw error;
    }
  };