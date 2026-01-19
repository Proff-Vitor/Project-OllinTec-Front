import { apiCall } from './api';

const OrdemServicoEquipamentoService = {
    async associarEquipamento(numeroOs: number, equipamentoId: number): Promise<any> {
        return await apiCall(`/os-equipamento`, 'POST', {
            numero_os: numeroOs,
            equipamento_id: equipamentoId
        });
    },

    async listarEquipamentosPorOS(numeroOs: number): Promise<any[]> {
        return await apiCall(`/os-equipamento/os/${numeroOs}`, 'GET');
    },

    async removerEquipamento(numeroOs: number, equipamentoId: number): Promise<void> {
        await apiCall(`/os-equipamento/${numeroOs}/${equipamentoId}`, 'DELETE');
    }
};

export default OrdemServicoEquipamentoService;
