import { apiCall } from './api';

export interface RelatorioOS {
  relatorioId?: number;
  numeroOs: number;
  dataCriacao?: string;
  descricao: string;
  tecnicoId?: number;
  dataInicio?: string;
  dataFim?: string;
}

const RelatorioOsService = {
  listarRelatorios: () => apiCall('/relatorio-os'),
  
  getRelatorio: (id: number) => apiCall(`/relatorio-os/${id}`),
  
  criarRelatorio: (relatorio: RelatorioOS) => 
    apiCall('/relatorio-os', 'POST', relatorio),
  
  atualizarRelatorio: (id: number, relatorio: RelatorioOS) => 
    apiCall(`/relatorio-os/${id}`, 'PUT', relatorio),
  
  deletarRelatorio: (id: number) => 
    apiCall(`/relatorio-os/${id}`, 'DELETE'),
};

export default RelatorioOsService;
