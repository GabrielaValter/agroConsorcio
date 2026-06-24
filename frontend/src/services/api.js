export const API_URL = "http://localhost:8080/agro-consorcio";

// rodar no celular
// export const API_URL = "http://172.20.10.8:8080/agro-consorcio";

export function getToken() {
    return localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

