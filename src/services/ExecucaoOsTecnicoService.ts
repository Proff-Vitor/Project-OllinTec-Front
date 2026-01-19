import { apiCall } from './api';

export interface ExecucaoOsTecnico {
    execucaoId?: number;
    numeroOs: number;
    tecnicoId: number;
    dataExecucao: string;
    observacao?: string;
}

const ExecucaoOsTecnicoService = {
    async criarExecucao(execucao: ExecucaoOsTecnico): Promise<ExecucaoOsTecnico> {
        return await apiCall('/execucao-os-tecnico', 'POST', execucao);
    },

    async listarPorOS(numeroOs: number): Promise<ExecucaoOsTecnico[]> {
        return await apiCall(`/execucao-os-tecnico/os/${numeroOs}`, 'GET');
    },

    async deletar(execucaoId: number): Promise<void> {
        await apiCall(`/execucao-os-tecnico/${execucaoId}`, 'DELETE');
    }
};

export default ExecucaoOsTecnicoService;
