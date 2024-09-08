

import React, { useState, useContext, useEffect} from 'react';
//import  Map  from './pages/map.tsx'; 
//import LocationFilter from './components/locationFilter.tsx';
import {Container} from 'react-bootstrap'
import DrawerAppBar from './components/DrawerAppBar';
import { AuthContext } from './components/Context';
import {User} from './models/user';
import LoggedInUserPage from './pages/LoggedInUserPage';
import * as user_api from './network/user_api';

const App: React.FC = () => {
  const [user, setUser] = useState<User|null>(null);
  const handleLoginClicked = () => {
    // navigate to login page
  }
  const handleSignupClicked = () => {
    // navigate to signup page
  }
  const handleLogoutClicked = () => {
    setUser(null);
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
  },[]
);

  
  return (
    //responsive row, xs for displaying on mobile devices
    // md for tablet, lg for desktop devices.
    <Container>
      <AuthContext.Provider value={{user, setUser}}>
      <Container>
        <DrawerAppBar 
        loggedUser={user}
        onLoginClick={handleLoginClicked}
        onSignupClick={handleSignupClicked}
        onLogoutClick={handleLogoutClicked}/>
      </Container>
      {user && <LoggedInUserPage/>}

      </AuthContext.Provider>
    </Container>
    
  );
}

export default App;
