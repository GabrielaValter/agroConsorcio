import { API_URL, logout, getToken } from "./api"

export async function cadastrarCultura(cultura) {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/cultura`, {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            },
            body : JSON.stringify(cultura)
        }
    );
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (!response.ok) {
        throw new Error("Erro ao cadastrar");
    }
    return response.json();
}

export async function editarCultura(id, cultura) {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/cultura/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cultura)
    });
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (!response.ok) {
        throw new Error("Erro ao editar cultura");
    }
    return response.json();
}

export async function listarCulturas() {
    const response = await fetch(`${API_URL}/cultura`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Erro ao listar culturas");
    }

    return response.json();
}

export async function buscarCultura(nome) {
    const response = await fetch(
        `${API_URL}/cultura/buscar?nome=${encodeURIComponent(nome)}`,
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar cultura");
    }

    return response.json();
}

export async function buscarCulturaPorId(id) {
    const response = await fetch(`${API_URL}/cultura/${id}`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar cultura");
    }

    return response.json();
}

export async function verificarNomeCultura(nome, id = null) {
    let url = `${API_URL}/cultura/verificar-nome?nome=${encodeURIComponent(nome)}`;

    if (id) {
        url += `&id=${id}`;
    }

    const response = await fetch(url, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Erro ao verificar nome da cultura");
    }

    return response.json();
}

export async function excluirCultura(id) {
    const token = getToken();

    const response = await fetch(`${API_URL}/cultura/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    if (!response.ok) {
        throw new Error("Erro ao excluir cultura");
    }
    
}

