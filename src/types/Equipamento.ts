export interface Equipamento {
  equipamento_id?: number;
  nome_equipamento: string;
  tipo_id: number;
  nome_tipo?: string;
  data_aquisicao: string;
  descricao: string;
  setor_id?: number;
}

export interface TipoEquipamento {
  tipo_equipamento_id?: number;
  nome_tipo: string;
}
