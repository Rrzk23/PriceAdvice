import { Request, Response } from 'express';
import { User } from '../../../shared/types';
import { searchUserbyEmail, updateUser} from '../utils/user';
import { generateToken } from '../utils/genToken';
import fs from 'fs'
export const registerUser = async (req : Request, res: Response): Promise<void> => {
    //let id : string = generateUserId();
    const user: User = {
        id: 1,
        name:"abc",
        email: req.body.email,
        password: req.body.password,
        token: 'abc123',
    };
    res.json(user);
    res.send();
};
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const user: User = await searchUserbyEmail(req.body.email);
    if (!user || user.password!== req.body.password) {
        throw res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = generateToken(user);
    user.token = token;

    // Save the user back to the database, if necessary
    await updateUser(user);

    
    res.json({...user, token: 'abc123' });
    res.send();
};