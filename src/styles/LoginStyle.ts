import styled from 'styled-components';

import background from '../assets/background.png'
import logo from '../assets/logo-Senai.png'



export const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-repeat: no-repeat;

`;

export const Logo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 8%;
  height: 4%;
  background-image: url(${logo});
  // background-size: cover;
  background-repeat: no-repeat;

`;



export const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.2); /* Fundo translúcido branco */
  backdrop-filter: blur(3px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 30%;
  height: 60%;
  border: solid 3px #D9D9D9;
`;

export const LoginTitle = styled.h2`
  color: #000;
  font-size: 1.7rem;
  padding-top: 5px;
  text-align: center;
  background-color: #D9D9D9;  
  width: 30%;
  height: 10%;
  border-radius: 5px;
  align-self: center;
  margin-bottom: 10%;
`;

export const InputGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  justify-self: center;
`;

export const InputLabel = styled.label`
  color: #fff;
  display: block;
  align-self: left;
  margin-bottom: 5px;
  margin-left: 10%;
`;

export const InputField = styled.input`
  width: 80%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 16px;
  align-self: center;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const LoginButton = styled.button`
  background-color: rgba(255, 255, 255, 0.8);
  width: 30%;
  color: #000;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  align-self: center;
  margin-top: 10%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

export const IconContainer = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
`;