import { createContext } from 'react';
import {User} from '../models/user';

export interface AuthenContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}
export const ThemeContext = createContext('light');
export const AuthContext = createContext<AuthenContextProps>(
    { user: null, setUser: () => {} }
);