import fs from 'fs';
import { User } from '../../../shared/types';
const databsePath = '../../models/databse.json';
//read the users
export const readUsers = async (): Promise<User[]> => {
  const users : User[] = [];
  return users;
};
//search and return the users by checking the email
export const searchUserbyEmail = async (email : string): Promise<User> => {
  const dataString = await fs.readFileSync(databsePath, 'utf-8');
  const users = JSON.parse(dataString);
  const user = users.find((target : User) => target.email === email);
  return user;
};
// update the user 
export const updateUser = async (user : User): Promise<void> => {
  const curUser : User = await searchUserbyEmail(user.email);
  if (curUser) {
    //update in the database
  } else {
    console.log('User not found');
    return;
  }
};
export const saveUsers = async (users: User[]): Promise<void> => {
  const jsonData = JSON.stringify(users, null, 2);
  await fs.promises.writeFile('databsePath', jsonData);
};
//export const generateUserId = async; 