const loginUser = async (email: string, senha: string) => {
    const data = {
      email: email,
      senha: senha
    }
  
    const url = process.env.REACT_APP_API_URL || "http://localhost:8080/api"
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro no login');
    }
  
    const responseData = await response.json();
    return responseData;
}

export default loginUser;
