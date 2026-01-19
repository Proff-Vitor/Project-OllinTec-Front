import { Usuario } from '../types/Usuario';

interface UsuarioState {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  loading: false,
  error: null,
};

const usuarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_USUARIOS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_USUARIOS_SUCCESS':
      return { ...state, usuarios: action.payload, loading: false };
    case 'FETCH_USUARIOS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_USUARIO':
      return { ...state, usuarios: [...state.usuarios, action.payload] };
    case 'UPDATE_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.map(u => u.usuario_id === action.payload.usuario_id ? action.payload : u),
      };
    case 'DELETE_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.filter(u => u.usuario_id !== action.payload),
      };
    default:
      return state;
  }
};

export default usuarioReducer;
