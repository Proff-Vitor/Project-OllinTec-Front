export interface Usuario {
  usuario_id?: number;
  nome: string;
  email: string;
  senha: string;
  is_admin: boolean;
  is_tecnico: boolean;
  setor_id?: number;
  tecnico_id?: number;
}
