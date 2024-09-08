
import {User} from '../models/user';
import { fetchData } from './priceNote_api';



export async function getLoggedInUser (): Promise<User> {
    const response = await fetchData('api/auth/', { method : 'GET' , credentials: 'include'});
    return response.json();
};
export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
};
export async function signUpUser (userSignUp: SignUpCredentials): Promise<User> {
    const response = await fetchData('api/auth/signup', { method : 'POST' ,
        
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSignUp),
    });
    return response.json();

}

export interface LoginCredentials {
    userNameOrEmail: string;
    password: string;
};

export async function loginUser (userLogIn: LoginCredentials): Promise<User> {
    const response = await fetchData('api/auth/login', { method : 'POST' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogIn),
    });
    return response.json();

}

export async function logoutUser (): Promise<void> {
    await fetchData('api/auth/logout', { method : 'POST', credentials: 'include',});
}