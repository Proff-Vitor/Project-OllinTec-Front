import { apiCall } from './api';

export interface Tecnico {
  tecnicoId?: number;
  nomeTecnico: string;
  especialidadeId?: number;
}

const TecnicoService = {
  listarTecnicos: () => apiCall('/tecnico'),
  
  getTecnico: (id: number) => apiCall(`/tecnico/${id}`),
  
  criarTecnico: (tecnico: Tecnico) => 
    apiCall('/tecnico', 'POST', tecnico),
  
  deletarTecnico: (id: number) => 
    apiCall(`/tecnico/${id}`, 'DELETE'),
};

export default TecnicoService;
