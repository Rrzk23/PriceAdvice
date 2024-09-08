import React, {useContext} from "react";
import  SignUp from '../components/sign-up/SignUp';
import { AuthContext } from '../components/Context';
import { User } from "../models/user";

const SignUpPage = () => {
    const context = useContext(AuthContext);
    const setUser = context.setUser;
    
    return (
        <SignUp 
        onHide={()=>{}}
        onSignUpSuccessfully= {(user : User)=>{
          setUser(user);
        }}/>
    )
};

export default SignUpPage;