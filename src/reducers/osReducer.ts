import { OrdemServico } from '../types/OrdemServico';

interface OSState {
  ordens: OrdemServico[];
  loading: boolean;
  error: string | null;
  osAtual: OrdemServico | null;
}

const initialState: OSState = {
  ordens: [],
  loading: false,
  error: null,
  osAtual: null,
};

const osReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_OS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_OS_SUCCESS':
      return { ...state, ordens: action.payload, loading: false };
    case 'FETCH_OS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'SET_OS_ATUAL':
      return { ...state, osAtual: action.payload, loading: false };
    case 'ADD_OS':
      return { ...state, ordens: [...state.ordens, action.payload] };
    case 'UPDATE_OS':
      return {
        ...state,
        ordens: state.ordens.map(o => o.numeroOs === action.payload.numeroOs ? action.payload : o),
        osAtual: state.osAtual?.numeroOs === action.payload.numeroOs ? action.payload : state.osAtual,
      };
    case 'DELETE_OS':
      return {
        ...state,
        ordens: state.ordens.filter(o => o.numeroOs !== action.payload),
      };
    default:
      return state;
  }
};

export default osReducer;
