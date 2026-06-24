import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/JustificativaConsorcio.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { buscarConsorcioPorId } from "../services/apiRelacaoCultura";
import { formatarNome } from "../utils/formatadores";
import { FaLink } from "react-icons/fa6"
import alfaceImg from "../assets/img/alface.png"; // mudar

function JustificativaConsorcio() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [relacao, setRelacao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarConsorcio();
    }, [id]);

    async function carregarConsorcio() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await buscarConsorcioPorId(id);
            setRelacao(resposta);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar justificativa do consórcio.");
        } finally {
            setCarregando(false);
        }
    }

    function obterCulturas() {
        return relacao?.culturasAssociadas?.map(item => item.cultura) || [];
    }

    function obterNomesCulturas() {
        return obterCulturas()
            .map(cultura => formatarNome(cultura.nomeCultura))
            .join(" + ");
    }

    function formatarTipo(tipo) {
        const tipos = {
            RECOMENDADA: "Compatível",
            NAO_RECOMENDADA: "Não compatível"
        };

        return tipos[tipo] || "-";
    }

    return (
        <div className="justificativa-page">
            <Navbar />

            <div className="justificativa-container">
                <h3>Resultado do Consórcio</h3>

                {carregando && <p className="mensagem">Carregando justificativa...</p>}
                {erro && <p className="erro">{erro}</p>}

                {!carregando && !erro && relacao && (
                    <>
                        <div className="justificativa-topo">
                            {obterCulturas().map((cultura, index) => (
                                <div className="cultura-resultado" key={cultura.idCultura}>
                                    {index > 0 && <span className="icone-corrente"><FaLink /></span>}

                                    <div>
                                        <strong>{formatarNome(cultura.nomeCultura)}</strong>
                                        <img src={alfaceImg} alt={cultura.nomeCultura} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="justificativa-grid">
                            <div className="coluna-esquerda">
                                <div className="bloco-justificativa">
                                    <h4>{formatarTipo(relacao.tipoRelacao)}</h4>
                                </div>

                                <div className="bloco-justificativa">
                                    <h4>Justificativa</h4>
                                    <p>{relacao.justificativa || "-"}</p>
                                </div>

                                <div className="mini-card-cultura">
                                    <h4>Observações sobre o consórcio</h4>
                                    <p>{relacao.observacaoConsorcio || "Nenhuma observação cadastrada."}</p>
                                </div>

                                <div className="bloco-justificativa">
                                    <h4>Referência Científica</h4>
                                    <p>
                                        {relacao.linkReferencia || "Nenhum link informado."}
                                        <br />
                                        Ano: {relacao.anoReferencia || "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="coluna-direita">
                                {obterCulturas().map((cultura) => (
                                    <div className="mini-card-cultura" key={cultura.idCultura}>
                                        <h4>{formatarNome(cultura.nomeCultura)}</h4>
                                        <p><strong>Tipo:</strong> {formatarNome(cultura.tipoCultura)}</p>
                                        <p><strong>Tempo estimado:</strong> {cultura.tempoEstimado ? `${cultura.tempoEstimado} dias` : "-"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default JustificativaConsorcio;