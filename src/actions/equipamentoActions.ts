import { Dispatch } from 'redux';
import EquipamentoService, { Equipamento } from '../services/EquipamentoService';

export const fetchEquipamentos = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_EQUIPAMENTOS_START' });
  try {
    const data = await EquipamentoService.listarEquipamentos();
    dispatch({ type: 'FETCH_EQUIPAMENTOS_SUCCESS', payload: data });
  } catch (error: any) {
    dispatch({ type: 'FETCH_EQUIPAMENTOS_FAILURE', payload: error.message });
  }
};

export const addEquipamento = (equipamento: Equipamento) => async (dispatch: Dispatch) => {
  try {
    const data = await EquipamentoService.cadastrarEquipamento(equipamento);
    dispatch({ type: 'ADD_EQUIPAMENTO', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_EQUIPAMENTOS_FAILURE', payload: error.message });
    throw error;
  }
};

export const updateEquipamento = (id: number, equipamento: Equipamento) => async (dispatch: Dispatch) => {
  try {
    const data = await EquipamentoService.editarEquipamento(id, equipamento);
    dispatch({ type: 'UPDATE_EQUIPAMENTO', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_EQUIPAMENTOS_FAILURE', payload: error.message });
    throw error;
  }
};

export const deleteEquipamento = (id: number) => async (dispatch: Dispatch) => {
  try {
    await EquipamentoService.deletarEquipamento(id);
    dispatch({ type: 'DELETE_EQUIPAMENTO', payload: id });
  } catch (error: any) {
    dispatch({ type: 'FETCH_EQUIPAMENTOS_FAILURE', payload: error.message });
    throw error;
  }
};
