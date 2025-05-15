import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {login} from '../../actions/authActions';
import { store, RootState, AppDispatch } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import {
    LoginPageContainer,
    LoginForm,
    LoginTitle,
    InputGroup,
    InputLabel,
    InputField,
    LoginButton,
    Logo
  } from '../../styles/LoginStyle';
import { Navigate } from "react-router-dom";


const Login: React.FC = () => {

    const navigate = useNavigate()


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasTriedLogin, setHasTriedLogin] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    
    const { isAuthenticated, error } = useSelector((state: any) => state.auth); 

    const verificationLogin = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(login(email, password))
        setHasTriedLogin(true);
    } 


    useEffect(() => {

        if(!hasTriedLogin) return;

        if(isAuthenticated) {
            toast.success("Login Realizado", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            
            setTimeout(() => {
                navigate("/home");
            }, 2000);

        } else{
            toast.error("Falha ao Realizar Login", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            setHasTriedLogin(false);
        }

        
    }, [isAuthenticated, navigate, hasTriedLogin])



    return ( 
        <LoginPageContainer>
            <ToastContainer/>
            <Logo/>
            <LoginForm>
                <LoginTitle>Login</LoginTitle>
                <InputGroup>
                <InputLabel htmlFor="username">Username</InputLabel>
                <InputField
                    type="String"
                    id="email"
                    placeholder="Seu email: "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </InputGroup>
                <InputGroup>
                <InputLabel htmlFor="password">Password</InputLabel>
                <InputField
                    type="password"
                    id="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </InputGroup>
                <LoginButton onClick={verificationLogin}>Login</LoginButton>
            </LoginForm>
        </LoginPageContainer>
  );
};


export default Login;