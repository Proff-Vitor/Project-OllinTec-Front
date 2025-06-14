import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {login} from '../../actions/authActions';
import { store, RootState, AppDispatch } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import style from '../../styles/LoginStyle.module.scss';
import styled from 'styled-components';

import background from '../assets/background.png';
import logo from '../assets/logo-Senai.png';
import { Navigate } from "react-router-dom";

import GlobalStyle from '../../styles/GlobalStyle.module.scss'


function Login(){

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
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.LoginForm}>
                <h2 className={style.LoginTitle}>Login</h2>
                <div className={style.InputGroup}>
                <label className={style.InputLabel} htmlFor="username">Username</label>
                <input className={style.InputField}
                    type="String"
                    id="email"
                    placeholder="Seu email: "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className={style.InputGroup}>
                <label className={style.InputLabel} htmlFor="password">Password</label>
                <input className={style.InputField}
                    type="password"
                    id="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button className={style.LoginButton} onClick={verificationLogin}>Login</button>
            </div>
        </div>
  );
};


export default Login;