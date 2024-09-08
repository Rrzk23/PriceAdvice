import React, {useContext} from "react";
import  SignUp from '../components/sign-up/SignUp';
import { AuthContext } from '../components/Context';
import { User } from "../models/user";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const context = useContext(AuthContext);
    const setUser = context.setUser;
    const navigate = useNavigate();
    
    return (
      <div>

        <SignUp 
        onHide={()=>{}}
        onSignUpSuccessfully= {(user : User)=>{
          setUser(user);
          navigate('/')
        }}/>
    
    </div>
    )
};

export default SignUpPage;