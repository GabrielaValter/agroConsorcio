import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/visualizar/Visualizar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePaginacao } from "../utils/paginacao";
import { listarCulturas, buscarCultura, excluirCultura } from "../services/apiCultura";
import { IoCreateOutline, IoTrashOutline, IoSearchOutline } from "react-icons/io5";
import { formatarNome } from "../utils/formatadores";

function CulturaVisualizar() {
    const navigate = useNavigate();

    const [culturas, setCulturas] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const {paginaAtual, totalPaginas, itensPaginados: culturasPaginadas, proximaPagina, paginaAnterior, voltarPrimeiraPagina} = usePaginacao(culturas, 15);

    useEffect(() => {
        carregarCulturas();
    }, []);

    async function carregarCulturas() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await listarCulturas();
            setCulturas(resposta);
            voltarPrimeiraPagina();
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar culturas.");
        } finally {
            setCarregando(false);
        }
    }

    async function pesquisarCultura() {
        try {
            setErro("");

            if (!buscar.trim()) {
                await carregarCulturas();
                return;
            }

            const resposta = await buscarCultura(buscar);
            setCulturas(resposta);
            voltarPrimeiraPagina();
        } catch (error) {
            console.error(error);
            setCulturas([]);
            setErro("Erro ao buscar cultura.");
        }
    }

    async function deletarCultura(cultura) {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir ${formatarNome(cultura.nomeCultura)}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await excluirCultura(cultura.idCultura);

            setCulturas((culturasAtuais) =>
                culturasAtuais.filter((item) => item.idCultura !== cultura.idCultura)
            );

            alert("Cultura excluída com sucesso!");
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao excluir cultura.");
        }
    }

    return (
        <div className="visualizar-page">
            <Navbar />

            <div className="visualizar-container">

                <div className="visualizar-header">
                    <h2>Lista de Culturas Cadastradas</h2>
                    
                    <div className="acoes-header">
                        <button className="button-adicionar" onClick={() => navigate("/cadastroCultura")}>
                            + Nova Cultura
                        </button>
                    </div>
                </div>

                <div className="barra-busca-container">
                    <div className="barra-busca">
                        <IoSearchOutline className="icone-busca" />
                        <input type="text" placeholder="Buscar cultura" value={buscar} onChange={(e) => setBuscar(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                pesquisarCultura();
                            }
                        }} />
                        <button className="button-buscar" onClick={pesquisarCultura}>Buscar</button>
                    </div>
                </div>

                <div className="visualizar-card">
                    {carregando && <p className="mensagem">Carregando culturas...</p>}

                    {erro && <p className="erro">{erro}</p>}

                    {!carregando && !erro && culturas.length === 0 && (
                        <p className="mensagem">Nenhuma cultura cadastrada.</p>
                    )}

                    {!carregando && !erro && culturas.length > 0 && (
                        <>
                            <div className="tabela-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Família</th>
                                            <th>Colheita</th>
                                            <th>Região principal</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {culturasPaginadas.map((cultura) => (
                                            <tr key={cultura.idCultura}>
                                                <td>{formatarNome(cultura.nomeCultura)}</td>
                                                <td>{formatarNome(cultura.tipoCultura) || "-"}</td>
                                                <td>{formatarNome(cultura.familia) || "-"}</td>
                                                <td>{cultura.tempoEstimado ? `${cultura.tempoEstimado} dias` : "-"}</td>
                                                <td>{formatarNome(cultura.regiaoPlantio) || "-"}</td>
                                                <td>
                                                    <div className="acoes">
                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Editar</span>
                                                            <button className="buttonEditar" onClick={() => navigate(`/editarCultura/${cultura.idCultura}`)} title="Editar">
                                                                <IoCreateOutline />
                                                            </button>
                                                        </div>

                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Excluir</span>
                                                            <button className="buttonExcluir" onClick={() => deletarCultura(cultura)} title="Excluir">
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
                                    <button type="button" className="button-ant" disabled={paginaAtual === 1} onClick={paginaAnterior} >
                                        Anterior
                                    </button>

                                    <span>
                                        Página {paginaAtual} de {totalPaginas}
                                    </span>

                                    <button type="button" className="button-prox" disabled={paginaAtual === totalPaginas} onClick={proximaPagina} >
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

export default CulturaVisualizar;