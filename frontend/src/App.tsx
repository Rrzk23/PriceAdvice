

import React, { useState, useContext, useEffect} from 'react';
//import  Map  from './pages/map.tsx'; 
//import LocationFilter from './components/locationFilter.tsx';
import {Container} from 'react-bootstrap'
import DrawerAppBar from './components/DrawerAppBar';
import { AuthContext } from './components/Context';
import {User} from './models/user';
import * as user_api from './network/user_api';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import UserPriceNodesPage from './pages/UserPriceNodesPage';
import SignUpPage from './pages/SingUpPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './styles/App.module.css';
import LoggedOutPage from './pages/LoggedOutPage';


const App: React.FC = () => {
  const [user, setUser] = useState<User|null>(null);

  const handleLogoutClicked = () => {
    setUser(null);
    user_api.logoutUser();
    // navigate to home page
  }

  useEffect(() => {
      async function fetchLoggedInUser() {
        try {
          const user = await user_api.getLoggedInUser();
          setUser(user);
        }
        catch (error) {
          console.error('Error fetching logged in user:', error);
        }
      }
      fetchLoggedInUser();
  },[]
);

  
  return (
    //responsive row, xs for displaying on mobile devices
    // md for tablet, lg for desktop devices.
    <BrowserRouter>
      <Container>
        <AuthContext.Provider value={{user, setUser}}>
          <DrawerAppBar 
          loggedUser={user}
          onLogoutClick={handleLogoutClicked}/>
        
        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path = '/'
              element={<UserPriceNodesPage/>}
            />
            <Route
              path = 'login'
              element={<LoginPage/>}
              />
            <Route
            path = 'signup'
            element={<SignUpPage/>}
            />
            <Route
            path = 'privacy'
            element={<PrivacyPage/>}
            />
            <Route
            path = '/logout'
            element={<LoggedOutPage/>}
            />
            <Route
            path = '/*'
            element={<NotFoundPage/>}
            />
          </Routes>
        </Container>

        </AuthContext.Provider>
      </Container>
    </BrowserRouter>
  );
}

export default App;
