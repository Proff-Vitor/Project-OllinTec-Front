import { apiCall } from './api';

export interface Usuario {
  usuario_id?: number;
  nome: string;
  email: string;
  senha: string;
  is_admin: boolean;
  is_tecnico: boolean;
  setor?: any;
  tecnico?: any;
}

const UsuarioService = {
  listarUsuarios: () => apiCall('/usuario'),
  
  getUsuario: (id: number) => apiCall(`/usuario/${id}`),
  
  cadastrarUsuario: (usuario: Usuario) => 
    apiCall('/usuario', 'POST', usuario),
  
  editarUsuario: (id: number, usuario: Usuario) => 
    apiCall(`/usuario/${id}`, 'PUT', usuario),
  
  deletarUsuario: (id: number) => 
    apiCall(`/usuario/${id}`, 'DELETE'),
};

export default UsuarioService;
