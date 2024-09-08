import React from "react";
import  SignIn from '../components/sign-in/SignIn';
import { AuthContext } from '../components/Context';

const LoginPage = () => {
    const context = React.useContext(AuthContext);
    const setUser = context.setUser;
    return (
        <SignIn
        onHide={()=>{}}
        onLoginSuccessfully= {(user)=>{
          setUser(user);
        }}
      />
    )
}

export default LoginPage;