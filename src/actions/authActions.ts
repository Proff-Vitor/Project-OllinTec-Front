import { Dispatch } from "redux";

import loginUser from "../services/AuthService";

export const login = (email: string, password: string) => {

    return async (dispatch: Dispatch) => {
       try{
        
        const data = await loginUser(email, password)

        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
            user: data
            }
        });

       } catch(error: any) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.message || 'Erro no login',
            })
       }
    };
};


