import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/cadastro/Cadastro.css";
import "../styles/cadastro/ConsorcioCadastro.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { cadastrarConsorcio, editarConsorcio, buscarConsorcioPorId, listarRelacoesCulturas } from "../services/apiRelacaoCultura";
import { listarCulturas } from "../services/apiCultura";
import { formatarNome, somenteNumeros, valorNumericoOuNull } from "../utils/formatadores";

function ConsorcioCadastro() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [etapa, setEtapa] = useState(1);
    const [culturas, setCulturas] = useState([]);
    const [buscaCultura, setBuscaCultura] = useState("");
    const [relacoes, setRelacoes] = useState([]);
    const [erros, setErros] = useState({});

    const cadastro = location.pathname === "/cadastroConsorcio";
    const modoEdicao = location.pathname.startsWith("/editarConsorcio");

    const [form, setForm] = useState({
        tipoRelacao: "",
        justificativa: "",
        linkReferencia: "",
        anoReferencia: "",
        observacaoConsorcio: "",
        idsCulturas: []
    });

    useEffect(() => {
        carregarCulturas();
        carregarRelacoes();
        carregarConsorcio();
    }, []);

    async function carregarCulturas() {
        try {
            const dados = await listarCulturas();
            setCulturas(dados);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar culturas");
        }
    }

    async function carregarRelacoes() {
        try {
            const dados = await listarRelacoesCulturas();
            setRelacoes(dados);
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarConsorcio() {
        if (!modoEdicao || !id) {
            return;
        }

        try {
            const consorcio = await buscarConsorcioPorId(id);

            const idsCulturas = consorcio.culturasAssociadas
                ? consorcio.culturasAssociadas
                    .map(item => item.cultura?.idCultura)
                    .filter(id => id !== undefined && id !== null)
                : [];

            setForm({
                tipoRelacao: consorcio.tipoRelacao || "",
                justificativa: consorcio.justificativa || "",
                linkReferencia: consorcio.linkReferencia || "",
                anoReferencia: consorcio.anoReferencia || "",
                observacaoConsorcio: consorcio.observacaoConsorcio || "",
                idsCulturas
            });
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao carregar consórcio");
            navigate("/visualizarConsorcio");
        }
    }

    function definirTitulo() {
        if (cadastro) {
            return "Cadastrar novo consórcio";
        }
        if (modoEdicao) {
            return "Editar consórcio";
        }
        return "Consórcio";
    }

    function alterarCampo(e) {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        if (erros[name]) {
            setErros({
                ...erros,
                [name]: ""
            });
        }
    }

    function alterarCampoNumerico(e) {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: somenteNumeros(value)
        });

        if (erros[name]) {
            setErros({
                ...erros,
                [name]: ""
            });
        }
    }

    function adicionarCultura(cultura) {
        if (form.idsCulturas.includes(cultura.idCultura)) {
            setErros({
                ...erros,
                idsCulturas: "Essa cultura já foi selecionada"
            });
            return;
        }

        if (form.idsCulturas.length >= 5) {
            setErros({
                ...erros,
                idsCulturas: "Selecione no máximo 5 culturas"
            });
            return;
        }

        setForm({
            ...form,
            idsCulturas: [...form.idsCulturas, cultura.idCultura]
        });

        setBuscaCultura("");
        setErros({
            ...erros,
            idsCulturas: ""
        });
    }

    function removerCultura(idCultura) {
        setForm({
            ...form,
            idsCulturas: form.idsCulturas.filter(id => id !== idCultura)
        });
    }

    function gerarAssinaturaFrontend(ids) {
        return [...ids].sort((a, b) => a - b).join("-");
    }

    // controle das etapas
    async function proximaEtapa() {
        if (etapa === 1) {
            const etapaValida = await validarEtapa1();

            if (!etapaValida) {
                return;
            }
        }

        if (etapa === 2 && !validarEtapa2()) {
            return;
        }

        setEtapa((etapaAtual) => etapaAtual + 1);
    }

    function voltarEtapa() {
        setEtapa((etapaAtual) => etapaAtual - 1);
    }

    async function validarEtapa1() {
        const novosErros = {};

        if (form.idsCulturas.length < 2) {
            novosErros.idsCulturas = "Selecione pelo menos 2 culturas";
        }
        if (form.idsCulturas.length > 5) {
            novosErros.idsCulturas = "Selecione no máximo 5 culturas";
        }

        const idsUnicos = new Set(form.idsCulturas);

        if (idsUnicos.size !== form.idsCulturas.length) {
            novosErros.idsCulturas = "Não é permitido repetir culturas";
        }
        if (!form.tipoRelacao) {
            novosErros.tipoRelacao = "O tipo da relação é obrigatório";
        }
        if (!form.justificativa.trim()) {
            novosErros.justificativa = "A justificativa é obrigatória";
        }

        const assinaturaAtual = gerarAssinaturaFrontend(form.idsCulturas);

        const relacaoJaExiste = relacoes.some(relacao => {
            if (modoEdicao && Number(relacao.idRelacao) === Number(id)) {
                return false;
            }

            return relacao.assinaturaCulturas === assinaturaAtual;
        });
        if (relacaoJaExiste) {
            novosErros.idsCulturas = "Já existe uma relação cadastrada com essa combinação de culturas";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    function validarEtapa2() {
        const novosErros = {};

        if (
            form.anoReferencia &&
            (Number(form.anoReferencia) < 1900 || Number(form.anoReferencia) > 2100)
        ) {
            novosErros.anoReferencia = "Informe um ano válido";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    function montarConsorcio() {
        return {
            ...form,
            anoReferencia: valorNumericoOuNull(form.anoReferencia)
        };
    }

    function cancelarFormulario() {
        const mensagem = modoEdicao
            ? "Tem certeza que deseja cancelar? Os dados alterados não serão salvos."
            : "Tem certeza que deseja cancelar? Os dados preenchidos serão perdidos.";

        const confirmar = window.confirm(mensagem);

        if (confirmar) {
            navigate("/visualizarConsorcio");
        }
    }

    const culturasFiltradas = culturas.filter(cultura =>
        buscaCultura &&
        cultura.nomeCultura
            .toLowerCase()
            .startsWith(buscaCultura.toLowerCase()) &&
        !form.idsCulturas.includes(cultura.idCultura)
    );

    const culturasSelecionadas = culturas.filter(cultura =>
        form.idsCulturas.includes(cultura.idCultura)
    );

    async function handleSubmit(e) {
        e.preventDefault();

        const etapa1Valida = await validarEtapa1();
        const etapa2Valida = validarEtapa2();

        if (!etapa1Valida || !etapa2Valida) {
            return;
        }

        try {
            const consorcio = montarConsorcio();

            console.log("Enviando consórcio:", consorcio);

            if (cadastro) {
                await cadastrarConsorcio(consorcio);
                alert("Consórcio cadastrado com sucesso!");
            }

            if (modoEdicao) {
                await editarConsorcio(id, consorcio);
                alert("Consórcio editado com sucesso!");
            }

            navigate("/visualizarConsorcio");
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao salvar consórcio");
        }
    }

    console.table(culturas);

    return (
        <div className="cadastro-page">
            <Navbar />

            <div className="cadastro-container">
                <h2>{definirTitulo()}</h2>

                <div className="indicador-etapas">
                    <span className={etapa === 1 ? "ativa" : ""}>Dados do consórcio</span>
                    <span className="separador">•</span>
                    <span className={etapa === 2 ? "ativa" : ""}>Informações Adicionais</span>
                </div>

                <div className="cadastro-card">

                    <form onSubmit={handleSubmit}>

                        {etapa === 1 && (
                            <>
                                <h4>Dados principais</h4>

                                <label>Nome das culturas <span className="obrigatorio">*</span></label>
                                <div className="campo-busca-cultura">
                                    <input
                                        type="text"
                                        placeholder="Digite o nome da cultura"
                                        value={buscaCultura}
                                        onChange={(e) => setBuscaCultura(e.target.value)}
                                    />

                                    {culturasFiltradas.length > 0 && (
                                        <div className="sugestoes-culturas">
                                            {culturasFiltradas.map(cultura => (
                                                <button
                                                    type="button"
                                                    key={cultura.idCultura}
                                                    className="sugestao-cultura"
                                                    onClick={() => adicionarCultura(cultura)}
                                                >
                                                    {formatarNome(cultura.nomeCultura)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="culturas-selecionadas">
                                    {culturasSelecionadas.map(cultura => (
                                        <div key={cultura.idCultura} className="cultura-selecionada">
                                            <span>{formatarNome(cultura.nomeCultura)}</span>
                                            <button
                                                type="button"
                                                onClick={() => removerCultura(cultura.idCultura)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {erros.idsCulturas && <p className="erro">{erros.idsCulturas}</p>}

                                <label>Tipo da relação <span className="obrigatorio">*</span></label>
                                <select
                                    name="tipoRelacao"
                                    value={form.tipoRelacao}
                                    onChange={alterarCampo}
                                >
                                    <option value="">Selecione</option>
                                    <option value="RECOMENDADA">Recomendada</option>
                                    <option value="NAO_RECOMENDADA">Não recomendada</option>
                                </select>
                                {erros.tipoRelacao && <p className="erro">{erros.tipoRelacao}</p>}

                                <label>Justificativa <span className="obrigatorio">*</span></label>
                                <textarea
                                    name="justificativa"
                                    placeholder="Explique por que essa combinação é recomendada ou não recomendada"
                                    value={form.justificativa}
                                    onChange={alterarCampo}
                                />
                                {erros.justificativa && <p className="erro">{erros.justificativa}</p>}

                                <div className="botoes-formulario">
                                    <button type="button" className="button-cancelar" onClick={cancelarFormulario}>
                                        <HiXMark />
                                        Cancelar
                                    </button>

                                    <button className="button-proximo" type="button" onClick={proximaEtapa}>
                                        <FiArrowRight />
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}

                        {etapa === 2 && (
                            <>
                                <h4>Referência e observações</h4>

                                <label>Observações</label>
                                <textarea
                                    name="observacaoConsorcio"
                                    placeholder="Observações adicionais sobre o consórcio"
                                    value={form.observacaoConsorcio}
                                    onChange={alterarCampo}
                                />

                                <label>Link de estudo</label>
                                <input
                                    type="text"
                                    name="linkReferencia"
                                    placeholder="URL da referência utilizada"
                                    value={form.linkReferencia}
                                    onChange={alterarCampo}
                                />

                                <label>Ano de referência</label>
                                <input
                                    type="text"
                                    name="anoReferencia"
                                    placeholder="Ex: 2024"
                                    value={form.anoReferencia}
                                    onChange={alterarCampoNumerico}
                                />
                                {erros.anoReferencia && <p className="erro">{erros.anoReferencia}</p>}

                                <div className="botoes-formulario">
                                    <button type="button" className="button-voltar" onClick={voltarEtapa}>
                                        <FiArrowLeft />
                                        Voltar
                                    </button>

                                    <button className="button-salvar" type="submit">
                                        <HiCheck />
                                        Salvar
                                    </button>
                                </div>  
                            </>
                        )}

                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ConsorcioCadastro;