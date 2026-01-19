interface AuthState {
    email: string;
    password: string;
    isAuthenticated: boolean;
    user: any;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    email: '',
    password: '',
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false,
};

const authReducer = (state = initialState, action: any) => {
    switch(action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                email: action.payload.email,
                password: action.payload.password,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
                loading: false,
            };
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
};

export default authReducer;