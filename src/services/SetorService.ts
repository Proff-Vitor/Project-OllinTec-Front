import { apiCall } from './api';

export interface Setor {
  setor_id?: number;
  nome_setor: string;
}

const SetorService = {
  listarSetores: () => apiCall('/setor/listarSetores'),
  
  getSetor: (id: number) => apiCall(`/setor/${id}`),
  
  cadastrarSetor: (setor: Setor) => 
    apiCall('/setor/cadastrarSetor', 'POST', setor),
  
  editarSetor: (id: number, setor: Setor) => 
    apiCall(`/setor/editarSetor/${id}`, 'PUT', setor),
  
  deletarSetor: (id: number) => 
    apiCall(`/setor/deletarSetor/${id}`, 'DELETE'),
};

export default SetorService;
