
interface AuthState {
    email: string;
    password: string;
    isAuthenticated: boolean;
}


const initialState: AuthState = {
    email: '',
    password: '',
    isAuthenticated: false,
};



const authReducer = (state = initialState, action: any) => {

    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return{
                ...state,
                email: action.payload.email,
                password: action.payload.password,
                isAuthenticated: true,
            };
        default:
            return state;
    }
};

export default authReducer;