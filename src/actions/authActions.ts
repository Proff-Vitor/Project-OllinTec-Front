import { Dispatch } from "redux";
import loginUser from "../services/AuthService";

export const login = (email: string, password: string) => {
    return async (dispatch: Dispatch) => {
       try{
        const data = await loginUser(email, password)

        if (data && data.success && data.user) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    email: email,
                    user: data.user
                }
            });
        } else {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: data?.message || 'Erro no login',
            })
        }

       } catch(error: any) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.message || 'Erro no login',
            })
       }
    };
};

export const logout = () => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: 'LOGOUT'
        });
    };
};


