import { apiCall } from './api';

export interface FiltroRelatorio {
  dataInicio?: string;
  dataFim?: string;
  statusId?: number;
  setorId?: number;
  tecnicoId?: number;
}

const RelatorioService = {
  listarRelatoriosOS: (filtro?: FiltroRelatorio) => {
    const params = new URLSearchParams();
    if (filtro?.dataInicio) params.append('dataInicio', filtro.dataInicio);
    if (filtro?.dataFim) params.append('dataFim', filtro.dataFim);
    if (filtro?.statusId) params.append('statusId', filtro.statusId.toString());
    if (filtro?.setorId) params.append('setorId', filtro.setorId.toString());
    if (filtro?.tecnicoId) params.append('tecnicoId', filtro.tecnicoId.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/relatorio-os${query}`);
  },
  
  listarRelatoriosMaterial: (filtro?: FiltroRelatorio) => {
    const params = new URLSearchParams();
    if (filtro?.dataInicio) params.append('dataInicio', filtro.dataInicio);
    if (filtro?.dataFim) params.append('dataFim', filtro.dataFim);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/relatorio-material${query}`);
  },
};

export default RelatorioService;
