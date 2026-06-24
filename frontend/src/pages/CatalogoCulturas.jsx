import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CatalogoCulturas.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { listarCulturas, buscarCultura } from "../services/apiCultura";
import { IoSearchOutline } from "react-icons/io5";
import { formatarNome } from "../utils/formatadores";
import alfaceImg from "../assets/img/alface.png"; // mudar

function CatalogoCulturas() {

    const navigate = useNavigate();

    const [culturas, setCulturas] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [tipoSelecionado, setTipoSelecionado] = useState("TODAS");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarCulturas();
    }, []);

    const culturasFiltradas = tipoSelecionado === "TODAS"
        ? culturas : culturas.filter((cultura) => cultura.tipoCultura === tipoSelecionado);

    async function carregarCulturas() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await listarCulturas();
            setCulturas(resposta);
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

            if (Array.isArray(resposta)) {
                setCulturas(resposta);
            } else {
                setCulturas([resposta]);
            }
        } catch (error) {
            console.error(error);
            setCulturas([]);
            setErro("Erro ao buscar cultura.");
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

    return (

        <div className="catalogo-page">
            <Navbar />
            
            <div className="catalogo-container">
                <h3>Catálogo de Culturas</h3>

                <div className="barra-busca-cultura">
                    <IoSearchOutline className="icone-busca-cultura" />

                    <input type="text" placeholder="Buscar por nome da cultura" value={buscar} onChange={(e) => setBuscar(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                pesquisarCultura();
                            }
                        }}
                    />

                    <button className="button-buscar-cultura" onClick={pesquisarCultura}>
                        Buscar
                    </button>
                </div>

                <div className="filtro-cultura">
                    <span className="span-filtro">Filtrar por: </span>
                    <button className={tipoSelecionado === "TODAS" ? "ativo" : ""} onClick={() => setTipoSelecionado("TODAS")}>
                        Todas
                    </button>
                    <button className={tipoSelecionado === "FOLHAS" ? "ativo" : ""} onClick={() => setTipoSelecionado("FOLHAS")}>
                        Folhas
                    </button>
                    <button className={tipoSelecionado === "RAIZES" ? "ativo" : ""} onClick={() => setTipoSelecionado("RAIZES")}>
                        Raízes
                    </button>
                    <button className={tipoSelecionado === "TUBERCULOS" ? "ativo" : ""} onClick={() => setTipoSelecionado("TUBERCULOS")}>
                        Tubérculos
                    </button>
                    <button className={tipoSelecionado === "BULBOS" ? "ativo" : ""} onClick={() => setTipoSelecionado("BULBOS")}>
                        Bulbos
                    </button>
                    <button className={tipoSelecionado === "FRUTOS" ? "ativo" : ""} onClick={() => setTipoSelecionado("FRUTOS")}>
                        Frutos
                    </button>
                    <button className={tipoSelecionado === "FLORES" ? "ativo" : ""} onClick={() => setTipoSelecionado("FLORES")}>
                        Flores
                    </button>
                </div>

                <div className="catalogo-grid">
                    {culturasFiltradas.map((cultura) => (
                        <div className="cultura-card" key={cultura.idCultura} onClick={() => navigate(`/informacaoCultura/${cultura.idCultura}`)}>
                            <h4>{formatarNome(cultura.nomeCultura)}</h4>

                            <img src={alfaceImg} alt={cultura.nomeCultura}/>

                            <p>{cultura.familia || "-"}</p>

                            <div className="info-card">
                                <span>
                                    Tempo estimado<br />
                                    {cultura.tempoEstimado ? `${cultura.tempoEstimado} dias` : "-"}
                                </span>

                                {/* <span>|</span> */}
                                <span>
                                    Região principal<br />
                                    {formatarRegiao(cultura.regiaoPlantio)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />

        </div>
    );
}

export default CatalogoCulturas;







