import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { User } from '../models/userModel';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';

interface SignUpUserBody extends RequestHandler {
  username: string;
  email: string;
  password: string;
}
interface LoginUserBody extends RequestHandler {
  userNameOrEmail: string;
  password: string;
}
//RequestHandler<req.params, res, req, local>
export const signUpUser: RequestHandler<unknown, unknown, SignUpUserBody, unknown> = async (req, res, next) =>{
  const userName = req.body.username;
  const userEmail = req.body.email;
  const passwordRaw = req.body.password;
  try {
    if (!userName || !userEmail || !passwordRaw) {
      throw createHttpError(400, 'User name, email or password missing');
    }
    // Validate email format
    const existingUserName = await User.findOne({ userName: userName }).exec();
    if (existingUserName) {
      throw createHttpError(409, 'User name already taken');
    }
    const existingUserEmail = await User.findOne({ userEmail: userEmail }).exec();
    if (existingUserEmail) {
      throw createHttpError(409, 'Email already in use');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    // Create new user
    const newUser = new User({
      userName: userName,
      userEmail: userEmail,
      password: hashedPassword,
    });
    //await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    next(error);
  }
};
export const loginUser : RequestHandler<unknown, unknown, LoginUserBody, unknown> = async (req, res, next) => {
  const userNameOrEmail = req.body.userNameOrEmail;
  const passwordRaw = req.body.password;
  
  
};