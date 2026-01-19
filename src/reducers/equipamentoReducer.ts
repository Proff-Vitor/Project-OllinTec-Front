import { Equipamento } from '../types/Equipamento';

interface EquipamentoState {
  equipamentos: Equipamento[];
  loading: boolean;
  error: string | null;
}

const initialState: EquipamentoState = {
  equipamentos: [],
  loading: false,
  error: null,
};

const equipamentoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_EQUIPAMENTOS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_EQUIPAMENTOS_SUCCESS':
      return { ...state, equipamentos: action.payload, loading: false };
    case 'FETCH_EQUIPAMENTOS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_EQUIPAMENTO':
      return { ...state, equipamentos: [...state.equipamentos, action.payload] };
    case 'UPDATE_EQUIPAMENTO':
      return {
        ...state,
        equipamentos: state.equipamentos.map(e => e.equipamento_id === action.payload.equipamento_id ? action.payload : e),
      };
    case 'DELETE_EQUIPAMENTO':
      return {
        ...state,
        equipamentos: state.equipamentos.filter(e => e.equipamento_id !== action.payload),
      };
    default:
      return state;
  }
};

export default equipamentoReducer;
