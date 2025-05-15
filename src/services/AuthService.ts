const loginUser = async (email: string, senha: string) => {
    const data = {
      email: email,
      senha: senha
    }
  
    const url = "https://back-spider.vercel.app"
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro no login');
    }
  
    return response.json(); 
  }
export default loginUser;

// Usuário Teste
// {
//     "email": "vitor@jesus.com",
//     "senha": "vitor"
// }