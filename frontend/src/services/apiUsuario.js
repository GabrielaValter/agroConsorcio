import { API_URL, logout, getToken } from "./api"

export async function loginUsuario(email, senha) {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, senha
            })
        }
    );
    if(!response.ok) {
        throw new Error("Email ou senha inválidos");
    }
    const data = await response.json();

    // salva token
    localStorage.setItem("token", data.token);

    // salvar usuário
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    
    return data.usuario;
}


export async function cadastrarUsuario(usuario) {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/usuarios`, {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            },
            body : JSON.stringify(usuario)
        }
    );
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (response.status === 403) {
        throw new Error("Você não possui permissão para esta ação.");
    }
    if (!response.ok) {
        throw new Error("Erro ao cadastrar");
    }
    return response.json();
}

export async function editarUsuario(id, usuario) {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
    });
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (response.status === 403) {
        throw new Error("Você não possui permissão para esta ação.");
    }
    if (!response.ok) {
        throw new Error("Erro ao editar usuário");
    }
    return response.json();
}

export async function listarColaboradores() {
    const token = getToken();

    const response = await fetch(`${API_URL}/usuarios`,
        {
            method : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        }
    );
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (response.status === 403) {
        throw new Error("Você não possui permissão para visualizar colaboradores.");
    }
    if(!response.ok) {
        throw new Error("Erro ao listar usuário");
    }
    return response.json();
}

export async function buscarColaborador(nome) {
    const token = getToken();

    const response= await fetch(`${API_URL}/usuarios/buscar?nome=${encodeURIComponent(nome)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Erro ao buscar colaborador");
    }
    return response.json();
}

export async function excluirColaborador(id) {
    const token = getToken();

    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (response.status === 403) {
        throw new Error("Você não possui permissão para esta ação.");
    }
    if (!response.ok) {
        throw new Error("Erro ao excluir colaborador");
    }
    
}

