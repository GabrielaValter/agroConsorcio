import { useState } from "react";

export function usePaginacao(lista, itensPorPagina = 15) {
    const [paginaAtual, setPaginaAtual] = useState(1);

    const totalPaginas = Math.ceil(lista.length / itensPorPagina);
    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = indiceInicial + itensPorPagina;
    const itensPaginados = lista.slice(indiceInicial, indiceFinal);

    function proximaPagina() {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual((pagina) => pagina + 1);
        }
    }

    function paginaAnterior() {
        if (paginaAtual > 1) {
            setPaginaAtual((pagina) => pagina - 1);
        }
    }

    function voltarPrimeiraPagina() {
        setPaginaAtual(1);
    }

    return {
        paginaAtual,
        totalPaginas,
        itensPaginados,
        proximaPagina,
        paginaAnterior,
        voltarPrimeiraPagina
    };
}