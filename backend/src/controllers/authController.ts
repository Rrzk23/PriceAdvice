import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import  User  from '../../models/userModel';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';


interface SignUpUserBody extends RequestHandler {
  username: string;
  email: string;
  password: string;
}
interface LoginUserBody extends RequestHandler {
  userNameOrEmail?: string;
  password?: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    
    const user = await User
      .findById(authenticatedUserId)
      .select('+email')
      .exec();
    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
};

export const signUpUser: RequestHandler<unknown, unknown, SignUpUserBody, unknown> = async (req, res, next) =>{
  const userName = req.body.username;
  const userEmail = req.body.email;
  const passwordRaw = req.body.password;
  try {
    if (!userName || !userEmail || !passwordRaw) {
      throw createHttpError(400, 'User name, email or password missing');
    }
    // Validate email format
    const existingUserName = await User.findOne({ username: userName }).exec();
    if (existingUserName) {
      throw createHttpError(409, 'User name already taken');
    }
    const existingUserEmail = await User.findOne({ email: userEmail }).exec();
    if (existingUserEmail) {
      throw createHttpError(409, 'Email already in use');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    // Create new user
    const newUser = await User.create({
      username: userName,
      email: userEmail,
      password: hashedPassword,
    });
    //await newUser.save();
    req.session.userId = newUser._id;
    res.status(201).json(newUser);
    // start session
    
    
  } catch (error) {
    next(error);
  }
};

export const loginUser : RequestHandler<unknown, unknown, LoginUserBody, unknown> = async (req, res, next) => {
  const userNameOrEmail = req.body.userNameOrEmail;
  const passwordRaw = req.body.password;
  try {
    if (!userNameOrEmail || !passwordRaw) { 
      throw createHttpError(400, 'User name or email or password missing');
    }
    const user = await User
      .findOne({ $or: [{ username: userNameOrEmail }, { email: userNameOrEmail }] })
      .select('+password +email +username')
      .exec();
    if (!user) {
      throw createHttpError(404, 'Incorrect password or email');
    }
    const isPasswordValid = await bcrypt.compare(passwordRaw, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Incorrect password or email');
    }
    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
  
};
export const logoutUser : RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ message: 'Logged out' });
    }
  });
};
