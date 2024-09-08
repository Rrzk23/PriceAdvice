import React from "react";
import  SignIn from '../components/sign-in/SignIn';
import { AuthContext } from '../components/Context';
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const context = React.useContext(AuthContext);
    const setUser = context.setUser;
    const navigate = useNavigate();
    return (
        <SignIn
        onHide={()=>{}}
        onLoginSuccessfully= {(user)=>{
          setUser(user);
          navigate('/')
        }}
      />
    )
}

export default LoginPage;