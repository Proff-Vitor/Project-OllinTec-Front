export interface OrdemServico {
    numeroOs?: number;
    dataCriacao?: string;
    usuarioCadastroId: number;
    titulo: string;
    descricao: string;
    statusId: number;
    dataEncerramento: string | null;
    setorId?: number;
    tecnicoId?: number;
    setor?: string;
    status?: string;
    nomeTecnico?: string;
}
  