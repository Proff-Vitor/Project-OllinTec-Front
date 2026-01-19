import { Setor } from '../types/Setor';

interface SetorState {
  setores: Setor[];
  loading: boolean;
  error: string | null;
}

const initialState: SetorState = {
  setores: [],
  loading: false,
  error: null,
};

const setorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_SETORES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SETORES_SUCCESS':
      return { ...state, setores: action.payload, loading: false };
    case 'FETCH_SETORES_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_SETOR':
      return { ...state, setores: [...state.setores, action.payload] };
    case 'UPDATE_SETOR':
      return {
        ...state,
        setores: state.setores.map(s => s.setor_id === action.payload.setor_id ? action.payload : s),
      };
    case 'DELETE_SETOR':
      return {
        ...state,
        setores: state.setores.filter(s => s.setor_id !== action.payload),
      };
    default:
      return state;
  }
};

export default setorReducer;
