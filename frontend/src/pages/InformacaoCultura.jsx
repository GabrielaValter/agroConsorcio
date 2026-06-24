import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/InformacaoCultura.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { buscarCulturaPorId } from "../services/apiCultura";
import { formatarNome } from "../utils/formatadores";
import { listarRelacoesCulturas } from "../services/apiRelacaoCultura";
import alfaceImg from "../assets/img/alface.png"; // mudar

function InformacaoCultura() {

    const [cultura, setCultura] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const [consorcios, setConsorcios] = useState([]);

    useEffect(() => {
        carregarCultura();
        carregarConsorcios();
    }, [id]);

    async function carregarCultura() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await buscarCulturaPorId(id);
            setCultura(resposta);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar informações da cultura.");
        } finally {
            setCarregando(false);
        }
    }

    function formatarRegiao(regiao) {
        const regioes = {
            NORTE: "Norte",
            NORDESTE: "Nordeste",
            CENTRO_OESTE: "Centro-Oeste",
            SUDESTE: "Sudeste",
            SUL: "Sul"
        };

        return regioes[regiao] || "-";
    }

    function formatarMes(mes) {
        const meses = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez"
        };

        return meses[mes] || "-";
    }

    async function carregarConsorcios() {
        try {
            const resposta = await listarRelacoesCulturas();

            const consorciosDaCultura = resposta
                .filter(relacao =>
                    relacao.culturasAssociadas?.some(
                        item => Number(item.cultura?.idCultura) === Number(id)
                    )
                )
                .sort((a, b) => {
                    if (a.tipoRelacao === "RECOMENDADA" && b.tipoRelacao !== "RECOMENDADA") {
                        return -1;
                    }
                    if (a.tipoRelacao !== "RECOMENDADA" && b.tipoRelacao === "RECOMENDADA") {
                        return 1;
                    }

                    return obterNomesOutrasCulturas(a).localeCompare(
                        obterNomesOutrasCulturas(b),
                        "pt-BR",
                        { sensitivity: "base" }
                    );
                });

            setConsorcios(consorciosDaCultura);
        } catch (error) {
            console.error(error);
        }
    }

    function obterOutrasCulturas(relacao) {
        return relacao.culturasAssociadas
            ?.filter(item => Number(item.cultura?.idCultura) !== Number(id))
            .map(item => item.cultura) || [];
    }

    function obterNomesOutrasCulturas(relacao) {
        return obterOutrasCulturas(relacao)
            .map(cultura => formatarNome(cultura.nomeCultura))
            .join(" + ");
    }

    function formatarTipoRelacao(tipo) {
        const tipos = {
            RECOMENDADA: "Recomendado",
            NAO_RECOMENDADA: "Não recomendado"
        };

        return tipos[tipo] || "-";
    }

    const consorciosRecomendados = consorcios.filter(
        (relacao) => relacao.tipoRelacao === "RECOMENDADA"
    );

    const consorciosNaoRecomendados = consorcios.filter(
        (relacao) => relacao.tipoRelacao === "NAO_RECOMENDADA"
    );

    function voltarCatalogo() {
        navigate("/catalogoCulturas");
    }

    return (

        <div className="informacao-page">
            <Navbar />
            
            <div className="informacao-container">
                <h3>Principais informações sobre a cultura</h3>

                {carregando && <p className="mensagem">Carregando informações...</p>}
                {erro && <p className="erro">{erro}</p>}

                {!carregando && !erro && cultura && (
                    <>
                        <div className="informacao-card">

                            <div className="info-topo">
                                <div className="img-info">
                                    <img src={alfaceImg} alt={cultura.nomeCultura} />
                                </div>

                                <h3>{formatarNome(cultura.nomeCultura)}</h3>

                                <div className="info-grid">
                                    <p><strong>Família:</strong><br />{cultura.familia || "-"}</p>
                                    <p><strong>Tipo de cultura:</strong><br />{formatarNome(cultura.tipoCultura)}</p>
                                    <p><strong>Região principal:</strong><br />{formatarRegiao(cultura.regiaoPlantio)}</p>
                                    <p><strong>Tempo estimado:</strong><br />{cultura.tempoEstimado ? `${cultura.tempoEstimado} dias` : "-"}</p>
                                    <p><strong>Espaço entre plantas:</strong><br />{cultura.espacoPlantas ? `${cultura.espacoPlantas} cm` : "-"}</p>
                                    <p><strong>Espaço entre linhas:</strong><br />{cultura.espacoLinhas ? `${cultura.espacoLinhas} cm` : "-"}</p>
                                    <p><strong>Sementes por cova:</strong><br />{cultura.sementeCova || "-"}</p>                        
                                </div>
                            </div>
                                
                            <div className="bloco-texto">
                                <p><strong>Demanda nutricional:</strong> {cultura.demandaNutricional || "-"}</p>
                            </div>
                            
                            <div className="bloco-texto">
                                <p><strong>Observações:</strong> {cultura.observacaoCultura || "-"}</p>
                            </div>

                            <div className="periodo-plantio">
                                <strong>Período de plantio por região</strong>

                                <div className="regioes-plantio">
                                    <div><strong>Norte</strong><span>{formatarMes(cultura.mesInicioNorte)} - {formatarMes(cultura.mesFimNorte)}</span></div>
                                    <div><strong>Nordeste</strong><span>{formatarMes(cultura.mesInicioNordeste)} - {formatarMes(cultura.mesFimNordeste)}</span></div>
                                    <div><strong>Centro-Oeste</strong><span>{formatarMes(cultura.mesInicioCentroOeste)} - {formatarMes(cultura.mesFimCentroOeste)}</span></div>
                                    <div><strong>Sudeste</strong><span>{formatarMes(cultura.mesInicioSudeste)} - {formatarMes(cultura.mesFimSudeste)}</span></div>
                                    <div><strong>Sul</strong><span>{formatarMes(cultura.mesInicioSul)} - {formatarMes(cultura.mesFimSul)}</span></div>
                                </div>
                            </div>
                        </div>

                        <h3>Sugestão de cultivo consorciado com {formatarNome(cultura.nomeCultura)}</h3>

                        {/* <div className="lista-consorcios-cultura">
                            {consorcios.length === 0 && (
                                <p className="mensagem">Nenhum consórcio cadastrado para esta cultura.</p>
                            )}

                            {consorcios.map((relacao) => (
                                <div className="card-consorcio-cultura" key={relacao.idRelacao}>
                                    <div className="culturas-consorcio">
                                        <img src={alfaceImg} alt={cultura.nomeCultura} />

                                        {obterOutrasCulturas(relacao).map((outraCultura) => (
                                            <div key={outraCultura.idCultura} className="cultura-associada">
                                                <span className="sinal-mais">+</span>
                                                <img src={alfaceImg} alt={outraCultura.nomeCultura}/>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="info-consorcio">
                                        <h4>
                                            {formatarNome(cultura.nomeCultura)} + {obterNomesOutrasCulturas(relacao)}
                                        </h4>

                                        <p>{relacao.justificativa}</p>
                                    </div>

                                    <button type="button" className="button-justificativa" onClick={() => navigate(`/JustificativaConsorcio/${relacao.idRelacao}`)}>
                                        Ver justificativa
                                    </button>
                                </div>
                            ))}
                        </div> */}

                        <div className="lista-consorcios-cultura">
                            {consorciosRecomendados.length > 0 && (
                                <>
                                    <div className="titulo-grupo recomendadas">
                                        Recomendadas
                                    </div>

                                    {consorciosRecomendados.map((relacao) => (
                                        <div className="card-consorcio-cultura recomendada" key={relacao.idRelacao}>

                                            <div className="culturas-consorcio">
                                                <img src={alfaceImg} alt={cultura.nomeCultura}/>
                                                {obterOutrasCulturas(relacao).map((outraCultura) => (
                                                    <div key={outraCultura.idCultura} className="cultura-associada">
                                                        <span className="sinal-mais">+</span>
                                                        <img src={alfaceImg} alt={outraCultura.nomeCultura}/>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="info-consorcio">
                                                <h4>
                                                    {formatarNome(cultura.nomeCultura)}
                                                    {" + "}
                                                    {obterNomesOutrasCulturas(relacao)}
                                                </h4>
                                                <p>{relacao.justificativa}</p>
                                            </div>

                                            <button type="button" className="button-justificativa" onClick={() => navigate(`/justificativaConsorcio/${relacao.idRelacao}`)}>
                                                Ver justificativa
                                            </button>

                                        </div>
                                    ))}
                                </>
                            )}

                            {consorciosNaoRecomendados.length > 0 && (
                                <>
                                    <div className="titulo-grupo nao-recomendadas">
                                        Não recomendadas
                                    </div>

                                    {consorciosNaoRecomendados.map((relacao) => (
                                        <div className="card-consorcio-cultura nao-recomendada" key={relacao.idRelacao}>

                                            <div className="culturas-consorcio">
                                                <img src={alfaceImg} alt={cultura.nomeCultura}/>

                                                {obterOutrasCulturas(relacao).map((outraCultura) => (
                                                    <div key={outraCultura.idCultura} className="cultura-associada">
                                                        <span className="sinal-mais">+</span>
                                                        <img src={alfaceImg} alt={outraCultura.nomeCultura}/>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="info-consorcio">
                                                <h4>
                                                    {formatarNome(cultura.nomeCultura)}
                                                    {" + "}
                                                    {obterNomesOutrasCulturas(relacao)}
                                                </h4>
                                                <p>{relacao.justificativa}</p>
                                            </div>

                                            <button type="button" className="button-justificativa button-nao-recomendado" onClick={() => navigate(`/justificativaConsorcio/${relacao.idRelacao}`)}>
                                                Ver justificativa
                                            </button>

                                        </div>
                                    ))}
                                </>
                            )}

                            {consorcios.length === 0 && (
                                <p className="mensagem">
                                    Nenhum consórcio cadastrado para esta cultura.
                                </p>
                            )}

                        </div>
                    </>
                )}
            </div>

            <Footer />

        </div>
    );
}

export default InformacaoCultura;







