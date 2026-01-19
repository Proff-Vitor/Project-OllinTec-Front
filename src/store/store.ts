import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import setorReducer from '../reducers/setorReducer';
import equipamentoReducer from '../reducers/equipamentoReducer';
import usuarioReducer from '../reducers/usuarioReducer';
import osReducer from '../reducers/osReducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        setor: setorReducer,
        equipamento: equipamentoReducer,
        usuario: usuarioReducer,
        os: osReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;