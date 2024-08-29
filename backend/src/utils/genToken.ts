import jwt from 'jsonwebtoken';
import { User } from '../../../shared/types';
const SECRET_KEY = 'your-secret-key';

export const generateToken = (user: User): string =>{
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};
