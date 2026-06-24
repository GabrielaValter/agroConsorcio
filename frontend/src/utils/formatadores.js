export function formatarNome(texto) {
    if (!texto) return "";

    return texto
        .toLowerCase()
        .split(" ")
        .map(palavra =>
            palavra.charAt(0).toUpperCase() +
            palavra.slice(1)
        )
        .join(" ");
}

export function somenteNumeros(valor = "") {
    return valor.replace(/\D/g, "");
}

// para campos numéricos salva 1 e não "1"
export function valorNumericoOuNull(valor) {
    return valor === "" ? null : Number(valor);
}