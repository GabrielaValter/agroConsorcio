import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/visualizar/Visualizar.css";
import "../styles/visualizar/ConsorcioVisualizar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePaginacao } from "../utils/paginacao";
import { listarRelacoesCulturas, buscarRelacoesPorTipo, excluirConsorcio } from "../services/apiRelacaoCultura";
import { IoCreateOutline, IoTrashOutline, IoSearchOutline } from "react-icons/io5";
import { formatarNome } from "../utils/formatadores";

function ConsorcioVisualizar() {
    const navigate = useNavigate();

    const [relacoes, setRelacoes] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("TODAS");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const {
        paginaAtual,
        totalPaginas,
        itensPaginados: relacoesPaginadas,
        proximaPagina,
        paginaAnterior,
        voltarPrimeiraPagina
    } = usePaginacao(relacoes, 15);

    useEffect(() => {
        carregarRelacoes();
    }, []);

    useEffect(() => {
        pesquisarConsorcio();
    }, [tipoFiltro]);

    async function carregarRelacoes() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await listarRelacoesCulturas();
            setRelacoes(ordenarRelacoes(resposta));
            voltarPrimeiraPagina();
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar consórcios.");
        } finally {
            setCarregando(false);
        }
    }

    function obterNomesCulturas(relacao) {
        if (!relacao.culturasAssociadas || relacao.culturasAssociadas.length === 0) {
            return "-";
        }

        return relacao.culturasAssociadas
            .map(item => formatarNome(item.cultura?.nomeCultura))
            .join(", ");
    }

    function ordenarRelacoes(lista) {
        return [...lista].sort((a, b) =>
            obterNomesCulturas(a).localeCompare(
                obterNomesCulturas(b),
                "pt-BR",
                { sensitivity: "base" }
            )
        );
    }

    async function pesquisarConsorcio() {
        try {
            setErro("");

            const resposta = await listarRelacoesCulturas();
            filtrarPorTexto(resposta);
        } catch (error) {
            console.error(error);
            setRelacoes([]);
            setErro("Erro ao buscar consórcio.");
        }
    }

    function filtrarPorTexto(lista) {
        let filtradas = lista;

        if (tipoFiltro !== "TODAS") {
            filtradas = filtradas.filter(
                relacao => relacao.tipoRelacao === tipoFiltro
            );
        }

        if (buscar.trim()) {
            const termo = buscar.toLowerCase();

            filtradas = filtradas.filter(relacao => {
                const culturas = obterNomesCulturas(relacao).toLowerCase();
                const justificativa = relacao.justificativa?.toLowerCase() || "";

                return (
                    culturas.startsWith(termo) ||
                    justificativa.startsWith(termo)
                );
            });
        }

        setRelacoes(ordenarRelacoes(filtradas));
        voltarPrimeiraPagina();
    }
    
    function formatarTipo(tipo) {
        const regioes = {
            RECOMENDADA: "Recomendado",
            NAO_RECOMENDADA: "Não Recomendado"
        };

        return regioes[tipo] || "-";
    }

    async function deletarConsorcio(relacao) {
        const culturas = obterNomesCulturas(relacao);

        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o consórcio entre ${culturas}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await excluirConsorcio(relacao.idRelacao);

            setRelacoes((relacoesAtuais) =>
                relacoesAtuais.filter((item) => item.idRelacao !== relacao.idRelacao)
            );

            alert("Consórcio excluído com sucesso!");
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao excluir consórcio.");
        }
    }

    return (
        <div className="visualizar-page">
            <Navbar />

            <div className="visualizar-container">

                <div className="visualizar-header">
                    <h2>Lista de Consórcios Cadastrados</h2>

                    <div className="acoes-header">
                        <button className="button-adicionar" onClick={() => navigate("/cadastroConsorcio")}>
                            + Novo Consórcio
                        </button>
                    </div>
                </div>

                <div className="barra-busca-container">
                    <div className="barra-busca">
                        <IoSearchOutline className="icone-busca" />
                        <input type="text" placeholder="Buscar por cultura, tipo ou justificativa" value={buscar} onChange={(e) => setBuscar(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    pesquisarConsorcio();
                                }
                            }}/>
                        <button className="button-buscar" onClick={pesquisarConsorcio}>Buscar</button>
                    </div>

                    <div className="filtrar-tipo">
                        <button className={tipoFiltro === "TODAS" ? "ativo" : ""} onClick={() => setTipoFiltro("TODAS")}>
                            <span className="radio-filtro">{tipoFiltro === "TODAS" ? "●" : "○"}</span>
                            Todos
                        </button>
                        <button className={tipoFiltro === "RECOMENDADA" ? "ativo" : ""} onClick={() => setTipoFiltro("RECOMENDADA")}>
                            <span className="radio-filtro">{tipoFiltro === "RECOMENDADA" ? "●" : "○"}</span>
                            Recomendados
                        </button>
                        <button className={tipoFiltro === "NAO_RECOMENDADA" ? "ativo" : ""} onClick={() => setTipoFiltro("NAO_RECOMENDADA")}>
                            <span className="radio-filtro">{tipoFiltro === "NAO_RECOMENDADA" ? "●" : "○"}</span>
                            Não Recomendados
                        </button>
                    </div>
                </div>

                <div className="visualizar-card">
                    {carregando && <p className="mensagem">Carregando consórcios...</p>}

                    {erro && <p className="erro">{erro}</p>}

                    {!carregando && !erro && relacoes.length === 0 && (
                        <p className="mensagem">Nenhum consórcio cadastrado.</p>
                    )}

                    {!carregando && !erro && relacoes.length > 0 && (
                        <>
                            <div className="tabela-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Culturas</th>
                                            <th>Tipo</th>
                                            <th>Justificativa</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {relacoesPaginadas.map((relacao) => (
                                            <tr key={relacao.idRelacao}>
                                                <td>{obterNomesCulturas(relacao)}</td>
                                                <td>{formatarTipo(relacao.tipoRelacao) || "-"}</td>
                                                <td>{relacao.justificativa || "-"}</td>
                                                <td>
                                                    <div className="acoes">
                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Editar</span>
                                                            <button
                                                                className="buttonEditar"
                                                                onClick={() => navigate(`/editarConsorcio/${relacao.idRelacao}`)}
                                                                title="Editar"
                                                            >
                                                                <IoCreateOutline />
                                                            </button>
                                                        </div>

                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Excluir</span>
                                                            <button
                                                                className="buttonExcluir"
                                                                onClick={() => deletarConsorcio(relacao)}
                                                                title="Excluir"
                                                            >
                                                                <IoTrashOutline />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPaginas > 1 && (
                                <div className="paginacao">
                                    <button
                                        type="button"
                                        className="button-ant"
                                        disabled={paginaAtual === 1}
                                        onClick={paginaAnterior}
                                    >
                                        Anterior
                                    </button>

                                    <span>
                                        Página {paginaAtual} de {totalPaginas}
                                    </span>

                                    <button
                                        type="button"
                                        className="button-prox"
                                        disabled={paginaAtual === totalPaginas}
                                        onClick={proximaPagina}
                                    >
                                        Próxima
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ConsorcioVisualizar;