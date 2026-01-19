import { apiCall } from './api';

export interface TipoEquipamento {
  tipo_equipamento_id?: number;
  nome_tipo: string;
}

export interface Equipamento {
  equipamento_id?: number;
  nome_equipamento: string;
  tipo_id: number;
  data_aquisicao: string;
  descricao: string;
  setor_id?: number;
}

const EquipamentoService = {
  listarEquipamentos: () => apiCall('/equipamento'),
  
  getEquipamento: (id: number) => apiCall(`/equipamento/${id}`),
  
  cadastrarEquipamento: (equipamento: Equipamento) => 
    apiCall('/equipamento', 'POST', equipamento),
  
  editarEquipamento: (id: number, equipamento: Equipamento) => 
    apiCall(`/equipamento/${id}`, 'PUT', equipamento),
  
  deletarEquipamento: (id: number) => 
    apiCall(`/equipamento/${id}`, 'DELETE'),
};

export default EquipamentoService;
