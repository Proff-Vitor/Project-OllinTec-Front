import { OrdemServico } from '../types/OrdemServico';

const api_url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

const ListOs =  async () => {

    const response = await fetch(`${api_url}/ordem-servico`)

    if (!response.ok) {      
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao Carregar OS');
    }

    return await response.json();

}


const RegisterOs = async (novaOs: OrdemServico): Promise<OrdemServico> => {

    const newOsDefault = {
        usuarioCadastroId: 4,        
        titulo: novaOs.titulo ?? "Sem título",                    
        descricao: novaOs.descricao ?? "Sem descrição",           
        statusId: 2,                           
        dataEncerramento: novaOs.dataEncerramento ?? null         
    };

    console.log(newOsDefault);
    
      
    
    const response = await fetch(`${api_url}/ordem-servico`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOsDefault),
    });

    console.log(response);
    

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar OS');
    }

    return await response.json();
};


const GetOsById = async (numeroOs: number) => {

  const response = await fetch(`${api_url}/ordem-servico/${numeroOs}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao buscar OS pelo ID');
  }

  return await response.json();

}

const UpdateOs = async (numeroOs: number, os: OrdemServico): Promise<OrdemServico> => {
  const response = await fetch(`${api_url}/ordem-servico/${numeroOs}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(os),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao atualizar OS');
  }

  return await response.json();
};

const DeleteOs = async (numeroOs: number) => {
  const response = await fetch(`${api_url}/ordem-servico/${numeroOs}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao deletar OS');
  }

  return await response.json();
};

export default {
    ListOs, 
    RegisterOs,
    GetOsById,
    UpdateOs,
    DeleteOs
}
