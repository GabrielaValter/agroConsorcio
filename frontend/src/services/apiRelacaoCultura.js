import { API_URL, logout, getToken } from "./api";

function tratarRespostaTexto(texto) {
    if (!texto) {
        return null;
    }

    try {
        return JSON.parse(texto);
    } catch {
        return texto;
    }
}

export async function cadastrarConsorcio(relacao) {
    const token = getToken();

    console.log("Token enviado:", token);

    const response = await fetch(`${API_URL}/relacoes-culturas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(relacao)
    });

    const respostaTexto = await response.text();

    if (response.status === 401) {
        logout();
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    if (response.status === 403) {
        console.log("Erro 403:", respostaTexto);
        console.log("Token enviado no 403:", token);
        throw new Error("Acesso negado pelo backend.");
    }

    if (!response.ok) {
        console.log("Erro backend:", respostaTexto);
        throw new Error(respostaTexto || "Erro ao cadastrar relação de culturas");
    }

    return respostaTexto ? JSON.parse(respostaTexto) : null;
}

export async function editarConsorcio(id, relacao) {
    const token = getToken();

    const response = await fetch(`${API_URL}/relacoes-culturas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(relacao)
    });

    const respostaTexto = await response.text();

    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Você não tem permissão ou sua sessão expirou. Faça login novamente.");
    }

    if (!response.ok) {
        console.log("Erro backend:", respostaTexto);
        throw new Error(respostaTexto || "Erro ao editar relação de culturas");
    }

    return tratarRespostaTexto(respostaTexto);
}

export async function listarRelacoesCulturas() {
    const response = await fetch(`${API_URL}/relacoes-culturas`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Erro ao listar relações de culturas");
    }

    return response.json();
}

export async function buscarConsorcioPorId(id) {
    const response = await fetch(`${API_URL}/relacoes-culturas/${id}`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar relação de culturas");
    }

    return response.json();
}

export async function buscarRelacoesPorTipo(tipo) {
    const response = await fetch(
        `${API_URL}/relacoes-culturas/tipo/${tipo}`,
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar relações por tipo");
    }

    return response.json();
}

export async function excluirConsorcio(id) {
    const token = getToken();

    const response = await fetch(`${API_URL}/relacoes-culturas/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const respostaTexto = await response.text();

    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Você não tem permissão ou sua sessão expirou. Faça login novamente.");
    }

    if (!response.ok) {
        console.log("Erro backend:", respostaTexto);
        throw new Error(respostaTexto || "Erro ao excluir relação de culturas");
    }
}