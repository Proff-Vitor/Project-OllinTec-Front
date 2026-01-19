import { Dispatch } from 'redux';
import UsuarioService, { Usuario } from '../services/UsuarioService';

export const fetchUsuarios = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_USUARIOS_START' });
  try {
    const data = await UsuarioService.listarUsuarios();
    dispatch({ type: 'FETCH_USUARIOS_SUCCESS', payload: data });
  } catch (error: any) {
    dispatch({ type: 'FETCH_USUARIOS_FAILURE', payload: error.message });
  }
};

export const addUsuario = (usuario: Usuario) => async (dispatch: Dispatch) => {
  try {
    const data = await UsuarioService.cadastrarUsuario(usuario);
    dispatch({ type: 'ADD_USUARIO', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_USUARIOS_FAILURE', payload: error.message });
    throw error;
  }
};

export const updateUsuario = (id: number, usuario: Usuario) => async (dispatch: Dispatch) => {
  try {
    const data = await UsuarioService.editarUsuario(id, usuario);
    dispatch({ type: 'UPDATE_USUARIO', payload: data });
    return data;
  } catch (error: any) {
    dispatch({ type: 'FETCH_USUARIOS_FAILURE', payload: error.message });
    throw error;
  }
};

export const deleteUsuario = (id: number) => async (dispatch: Dispatch) => {
  try {
    await UsuarioService.deletarUsuario(id);
    dispatch({ type: 'DELETE_USUARIO', payload: id });
  } catch (error: any) {
    dispatch({ type: 'FETCH_USUARIOS_FAILURE', payload: error.message });
    throw error;
  }
};
