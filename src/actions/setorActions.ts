import { Dispatch } from 'redux';
import SetorService, { Setor } from '../services/SetorService';

export const fetchSetores = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_SETORES_START' });
  try {
    const data = await SetorService.listarSetores();
    dispatch({ type: 'FETCH_SETORES_SUCCESS', payload: data });
  } catch (error: any) {
    dispatch({ type: 'FETCH_SETORES_FAILURE', payload: error.message });
  }
};

export const addSetor = (setor: Setor) => async (dispatch: Dispatch) => {
  try {
    const data = await SetorService.cadastrarSetor(setor);
    dispatch({ type: 'ADD_SETOR', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_SETORES_FAILURE', payload: error.message });
    throw error;
  }
};

export const updateSetor = (id: number, setor: Setor) => async (dispatch: Dispatch) => {
  try {
    const data = await SetorService.editarSetor(id, setor);
    dispatch({ type: 'UPDATE_SETOR', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_SETORES_FAILURE', payload: error.message });
    throw error;
  }
};

export const deleteSetor = (id: number) => async (dispatch: Dispatch) => {
  try {
    await SetorService.deletarSetor(id);
    dispatch({ type: 'DELETE_SETOR', payload: id });
  } catch (error: any) {
    dispatch({ type: 'FETCH_SETORES_FAILURE', payload: error.message });
    throw error;
  }
};
