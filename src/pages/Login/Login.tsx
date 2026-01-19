import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { login } from '../../actions/authActions';
import { AppDispatch } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import style from '../../styles/LoginStyle.module.scss';
import UsuarioService from '../../services/UsuarioService';

import GlobalStyle from '../../styles/GlobalStyle.module.scss'


function Login(){

    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [registerData, setRegisterData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmSenha: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    
    const { isAuthenticated, error } = useSelector((state: any) => state.auth); 

    const verificationLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);
        try {
            await dispatch(login(email, password) as any);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!registerData.nome || !registerData.email || !registerData.senha) {
            toast.error("Preencha todos os campos", { theme: "dark" });
            return;
        }

        if (registerData.senha !== registerData.confirmSenha) {
            toast.error("As senhas não coincidem", { theme: "dark" });
            return;
        }

        setLoading(true);
        try {
            await UsuarioService.cadastrarUsuario({
                nome: registerData.nome,
                email: registerData.email,
                senha: registerData.senha,
                is_admin: false,
                is_tecnico: false
            });
            
            toast.success("Cadastro realizado com sucesso! Faça login.", { theme: "dark" });
            setIsRegisterMode(false);
            setRegisterData({ nome: '', email: '', senha: '', confirmSenha: '' });
            setEmail('');
            setPassword('');
        } catch (error: any) {
            toast.error(error.message || "Erro ao cadastrar", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            toast.success("Login Realizado", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if(error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
    }, [error])

    return ( 
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.Container}>
                {!isRegisterMode ? (
                    <div className={style.LoginForm}>
                        <h2 className={style.LoginTitle}>Login</h2>
                        <form onSubmit={verificationLogin}>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel} htmlFor="email">Email</label>
                                <input className={style.InputField}
                                    type="email"
                                    id="email"
                                    placeholder="Seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel} htmlFor="password">Senha</label>
                                <input className={style.InputField}
                                    type="password"
                                    id="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                className={style.LoginButton} 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Entrando..." : "Login"}
                            </button>
                        </form>
                        <div className={style.RegisterLink}>
                            <p>Não tem conta? <button type="button" onClick={() => setIsRegisterMode(true)} className={style.LinkButton}>Cadastre-se</button></p>
                        </div>
                    </div>
                ) : (
                    <div className={style.RegisterForm}>
                        <h2 className={style.LoginTitle}>Cadastro de Usuário</h2>
                        <form onSubmit={handleRegister}>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel}>Nome</label>
                                <input className={style.InputField}
                                    type="text"
                                    placeholder="Seu nome"
                                    value={registerData.nome}
                                    onChange={(e) => setRegisterData({...registerData, nome: e.target.value})}
                                    required
                                />
                            </div>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel}>Email</label>
                                <input className={style.InputField}
                                    type="email"
                                    placeholder="Seu email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel}>Senha</label>
                                <div className={style.PasswordWrapper}>
                                    <input className={style.InputField}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Sua senha"
                                        value={registerData.senha}
                                        onChange={(e) => setRegisterData({...registerData, senha: e.target.value})}
                                        required
                                    />
                                    <button type="button" className={style.TogglePassword} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>
                            <div className={style.InputGroup}>
                                <label className={style.InputLabel}>Confirmar Senha</label>
                                <div className={style.PasswordWrapper}>
                                    <input className={style.InputField}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirme sua senha"
                                        value={registerData.confirmSenha}
                                        onChange={(e) => setRegisterData({...registerData, confirmSenha: e.target.value})}
                                        required
                                    />
                                    <button type="button" className={style.TogglePassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>
                            <div className={style.ButtonGroup}>
                                <button 
                                    className={style.LoginButton} 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </button>
                                <button 
                                    className={style.BackButton} 
                                    type="button"
                                    onClick={() => setIsRegisterMode(false)}
                                >
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
  );
};


export default Login;