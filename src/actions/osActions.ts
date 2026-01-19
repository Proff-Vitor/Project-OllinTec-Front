import { Dispatch } from 'redux';
import osapi from '../services/OSAPI';
import { OrdemServico } from '../types/OrdemServico';

export const fetchOrdensSevico = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_OS_START' });
  try {
    const data = await osapi.ListOs();
    dispatch({ type: 'FETCH_OS_SUCCESS', payload: data });
  } catch (error: any) {
    dispatch({ type: 'FETCH_OS_FAILURE', payload: error.message });
  }
};

export const getOrdemServico = (numeroOs: number) => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_OS_START' });
  try {
    const data = await osapi.GetOsById(numeroOs);
    dispatch({ type: 'SET_OS_ATUAL', payload: data });
  } catch (error: any) {
    dispatch({ type: 'FETCH_OS_FAILURE', payload: error.message });
  }
};

export const addOrdemServico = (os: OrdemServico) => async (dispatch: Dispatch) => {
  try {
    const data = await osapi.RegisterOs(os);
    dispatch({ type: 'ADD_OS', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_OS_FAILURE', payload: error.message });
    throw error;
  }
};

export const updateOrdemServico = (numeroOs: number, os: OrdemServico) => async (dispatch: Dispatch) => {
  try {
    const data = await osapi.UpdateOs(numeroOs, os);
    dispatch({ type: 'UPDATE_OS', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_OS_FAILURE', payload: error.message });
    throw error;
  }
};

export const deleteOrdemServico = (numeroOs: number) => async (dispatch: Dispatch) => {
  try {
    await osapi.DeleteOs(numeroOs);
    dispatch({ type: 'DELETE_OS', payload: numeroOs });
  } catch (error: any) {
    dispatch({ type: 'FETCH_OS_FAILURE', payload: error.message });
    throw error;
  }
};
