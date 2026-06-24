import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/cadastro/Cadastro.css"
import "../styles/cadastro/CulturaCadastro.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { formatarNome, somenteNumeros, valorNumericoOuNull } from "../utils/formatadores"
import { IoInformationCircleOutline } from "react-icons/io5";
import { cadastrarCultura, editarCultura, buscarCulturaPorId, verificarNomeCultura } from "../services/apiCultura";

function CulturaCadastro() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [etapa, setEtapa] = useState(1);
    const [erros, setErros] = useState({});

    const cadastro = location.pathname === "/cadastroCultura";
    const modoEdicao = location.pathname.startsWith("/editarCultura");

    // objeto único para guardar os estados
    const [form, setForm] = useState({
        nomeCultura: "",
        tipoCultura: "",
        familia: "",
        tempoEstimado: "",
        espacoPlantas: "",
        espacoLinhas: "",
        sementeCova: "",
        demandaNutricional: "",
        observacaoCultura: "",
        arquivoFoto: "",
        regiaoPlantio: "",

        mesInicioNorte: "",
        mesFimNorte: "",
        mesInicioNordeste: "",
        mesFimNordeste: "",
        mesInicioCentroOeste: "",
        mesFimCentroOeste: "",
        mesInicioSudeste: "",
        mesFimSudeste: "",
        mesInicioSul: "",
        mesFimSul: ""
    })

    const meses = [
        { valor: 1, nome: "Janeiro" },
        { valor: 2, nome: "Fevereiro" },
        { valor: 3, nome: "Março" },
        { valor: 4, nome: "Abril" },
        { valor: 5, nome: "Maio" },
        { valor: 6, nome: "Junho" },
        { valor: 7, nome: "Julho" },
        { valor: 8, nome: "Agosto" },
        { valor: 9, nome: "Setembro" },
        { valor: 10, nome: "Outubro" },
        { valor: 11, nome: "Novembro" },
        { valor: 12, nome: "Dezembro" }
    ];


    // carregar cultura em modo edição
    useEffect(() => {
        async function carregarCultura() {
            if (modoEdicao && id) {
                try {
                    const cultura = await buscarCulturaPorId(id);

                    setForm({
                        nomeCultura: cultura.nomeCultura || "",
                        tipoCultura: cultura.tipoCultura || "",
                        familia: cultura.familia || "",
                        tempoEstimado: cultura.tempoEstimado || "",
                        espacoPlantas: cultura.espacoPlantas || "",
                        espacoLinhas: cultura.espacoLinhas || "",
                        sementeCova: cultura.sementeCova || "",
                        demandaNutricional: cultura.demandaNutricional || "",
                        observacaoCultura: cultura.observacaoCultura || "",
                        arquivoFoto: cultura.arquivoFoto || "",
                        regiaoPlantio: cultura.regiaoPlantio || "",

                        mesInicioNorte: cultura.mesInicioNorte || "",
                        mesFimNorte: cultura.mesFimNorte || "",
                        mesInicioNordeste: cultura.mesInicioNordeste || "",
                        mesFimNordeste: cultura.mesFimNordeste || "",
                        mesInicioCentroOeste: cultura.mesInicioCentroOeste || "",
                        mesFimCentroOeste: cultura.mesFimCentroOeste || "",
                        mesInicioSudeste: cultura.mesInicioSudeste || "",
                        mesFimSudeste: cultura.mesFimSudeste || "",
                        mesInicioSul: cultura.mesInicioSul || "",
                        mesFimSul: cultura.mesFimSul || ""
                    });
                } catch (error) {
                    alert(error.message || "Erro ao carregar cultura");
                    navigate("/visualizarCultura");  
                }
            }
        }
        carregarCultura();
    }, [id, modoEdicao, navigate]);

    function SelectMes({ label, name, value }) {
        return (
            <>
                <label>{label}</label>
                <select name={name} value={value} onChange={alterarCampo}>
                    <option value="">Selecione</option>
                    {meses.map((mes) => (
                        <option key={mes.valor} value={mes.valor}>
                            {mes.nome}
                        </option>
                    ))}
                </select>
            </>
        );
    }

    // alteração dos campos do formulário
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

    function definirTitulo() {
        if (cadastro) {
            return "Cadastrar nova cultura";
        }
        if (modoEdicao) {
            if (form.nomeCultura) {
                return `Editar cultura: ${formatarNome(form.nomeCultura)}`;
            }
            return "Editar cultura";
        }
        return "Cultura";
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

    // validações
    async function validarEtapa1() {
        const novosErros = {};

        if (!form.nomeCultura.trim()) {
            novosErros.nomeCultura = "O nome da cultura é obrigatório";
        }
        if (!form.tipoCultura) {
            novosErros.tipoCultura = "O tipo da cultura é obrigatório";
        }
        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return false;
        }

        try {
            const nomeExiste = await verificarNomeCultura(
                form.nomeCultura,
                modoEdicao ? id : null
            );

            if (nomeExiste) {
                novosErros.nomeCultura = "Já existe uma cultura cadastrada com este nome";
                setErros(novosErros);
                return false;
            }
        } catch (error) {
            console.error(error);
            novosErros.nomeCultura = "Não foi possível verificar o nome da cultura";
            setErros(novosErros);
            return false;
        }

        setErros({});
        return true;
    }

    function validarEtapa2() {
        const novosErros = {};

        if (!form.arquivoFoto.trim()) {
            novosErros.arquivoFoto = "A foto da cultura é obrigatória";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function validarFormulario() {
        const etapa1Valida = await validarEtapa1();
        const etapa2Valida = validarEtapa2();

        return etapa1Valida && etapa2Valida;
    }

    // montagem do objeto enviado ao backend
    function montarCultura() {
        return {
            ...form,
            tempoEstimado: valorNumericoOuNull(form.tempoEstimado),
            espacoPlantas: valorNumericoOuNull(form.espacoPlantas),
            espacoLinhas: valorNumericoOuNull(form.espacoLinhas),
            sementeCova: valorNumericoOuNull(form.sementeCova),
            // regiaoPlantio precisa estar aqui porque não é obrigatório e se ficar em branco pode ser enviado ao back como ""
            regiaoPlantio: form.regiaoPlantio === "" ? null : form.regiaoPlantio,

            mesInicioNorte: valorNumericoOuNull(form.mesInicioNorte),
            mesFimNorte: valorNumericoOuNull(form.mesFimNorte),
            mesInicioNordeste: valorNumericoOuNull(form.mesInicioNordeste),
            mesFimNordeste: valorNumericoOuNull(form.mesFimNordeste),
            mesInicioCentroOeste: valorNumericoOuNull(form.mesInicioCentroOeste),
            mesFimCentroOeste: valorNumericoOuNull(form.mesFimCentroOeste),
            mesInicioSudeste: valorNumericoOuNull(form.mesInicioSudeste),
            mesFimSudeste: valorNumericoOuNull(form.mesFimSudeste),
            mesInicioSul: valorNumericoOuNull(form.mesInicioSul),
            mesFimSul: valorNumericoOuNull(form.mesFimSul)
        };
    } 

    function cancelarFormulario() {
        const mensagem = modoEdicao
        ? "Tem certeza que deseja cancelar? Os dados alterados não serão salvos."
        : "Tem certeza que deseja cancelar? Os dados preenchidos serão perdidos.";
        const confirmar = window.confirm(mensagem);
        
        if (confirmar) {
            navigate("/visualizarCultura");
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

    // envio do formulário
    async function handleSubmit(e) {
        e.preventDefault();

        const formularioValido = await validarFormulario();
        
        if (!formularioValido) {
            return;
        }
        
        try {
            const cultura = montarCultura();
           
            if (cadastro) {
                await cadastrarCultura(cultura);
                alert("Cultura cadastrada com sucesso!");
            }
            if (modoEdicao) {
                await editarCultura(id, cultura);
                alert("Cultura editada com sucesso!");
            }

            navigate("/visualizarCultura");  
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao salvar cultura");
        }
    }

    return (

        <div className="cadastro-page">

            <Navbar/>

            <div className="cadastro-container">

                <h2>{definirTitulo()}</h2>

                <div className="indicador-etapas">
                    <span className={etapa === 1 ? "ativa" : ""}>Dados da Cultura</span>
                    <span className="separador">•</span>
                    <span className={etapa === 2 ? "ativa" : ""}>Informações Adicionais</span>
                    <span className="separador">•</span>
                    <span className={etapa === 3 ? "ativa" : ""}>Período de Plantio</span>
                </div>

                <div className="cadastro-card">

                    <form onSubmit={handleSubmit}>

                        {etapa === 1 && (
                            <>
                                <h4>Dados da cultura</h4>

                                <div className="etapa1-grid">
                                    <div className="coluna-esquerda">
                                        <label>Nome da cultura <span className="obrigatorio">*</span>
                                            <span className="tooltip-container">
                                                <IoInformationCircleOutline className="icone-info" />
                                                <span className="tooltip-text">
                                                    O nome da cultura deve ser único
                                                </span>
                                            </span>
                                        </label>
                                        <input type="text" name="nomeCultura" placeholder="Ex: Alface americana" value={form.nomeCultura} onChange={alterarCampo} />
                                        {erros.nomeCultura && <p className="erro">{erros.nomeCultura}</p>}

                                        <label>Tipo da cultura <span className="obrigatorio">*</span></label>
                                        <select name="tipoCultura" value={form.tipoCultura} onChange={alterarCampo}>
                                            <option value="">Selecione</option>
                                            <option value="FOLHAS">Folhas</option>
                                            <option value="RAIZES">Raízes</option>
                                            <option value="TUBERCULOS">Tubérculos</option>
                                            <option value="BULBOS">Bulbos</option>
                                            <option value="FRUTOS">Frutos</option>
                                            <option value="FLORES">Flores</option>
                                        </select>
                                        {erros.tipoCultura && <p className="erro">{erros.tipoCultura}</p>}

                                        <label>Família</label>
                                        <input type="text" name="familia" placeholder="Ex: Asteraceae" value={form.familia} onChange={alterarCampo} />
                                    
                                        <label>Estimativa de dias para a colheita</label>
                                        <input type="text" name="tempoEstimado" placeholder="Ex: 90" value={form.tempoEstimado} onChange={alterarCampoNumerico} />
                                    </div>

                                    <div className="coluna-direita">
                                        <label>Espaço entre plantas em cm</label>
                                        <input type="text" name="espacoPlantas" placeholder="Ex: 20" value={form.espacoPlantas} onChange={alterarCampoNumerico} />

                                        <label>Espaço entre linhas em cm</label>
                                        <input type="text" name="espacoLinhas" placeholder="Ex: 30" value={form.espacoLinhas} onChange={alterarCampoNumerico} />

                                        <label>Sementes por cova</label>
                                        <input type="text" name="sementeCova" placeholder="Ex: 3" value={form.sementeCova} onChange={alterarCampoNumerico} />
                                    </div>
                                </div>

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
                                <h4>Informações adicionais</h4>

                                <label>Demanda nutricional</label>
                                <textarea name="demandaNutricional" placeholder="Ex: Necessita de solo rico em matéria orgânica" value={form.demandaNutricional} onChange={alterarCampo} />

                                <label>Observações</label>
                                <textarea name="observacaoCultura" placeholder="Observações sobre a cultura" value={form.observacaoCultura} onChange={alterarCampo} />

                                <label>Foto da cultura <span className="obrigatorio">*</span></label>
                                <input type="text" name="arquivoFoto" placeholder="URL ou caminho da imagem" value={form.arquivoFoto} onChange={alterarCampo} />
                                {erros.arquivoFoto && <p className="erro">{erros.arquivoFoto}</p>}

                                <label>Região principal de plantio</label>
                                <select name="regiaoPlantio" value={form.regiaoPlantio} onChange={alterarCampo}>
                                    <option value="">Selecione</option>
                                    <option value="NORTE">Norte</option>
                                    <option value="NORDESTE">Nordeste</option>
                                    <option value="CENTRO_OESTE">Centro-Oeste</option>
                                    <option value="SUDESTE">Sudeste</option>
                                    <option value="SUL">Sul</option>
                                </select>

                                <div className="botoes-formulario">
                                    <button className="button-voltar" type="button" onClick={voltarEtapa}>
                                        <FiArrowLeft />
                                        Voltar
                                    </button>

                                    <button className="button-proximo" type="button" onClick={proximaEtapa}>
                                        <FiArrowRight />
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {etapa === 3 && (
                            <>
                                <h4>Período de plantio por região</h4>

                                <div className="meses">
                                    <div className="regiao-meses">
                                        <h5>Norte</h5>
                                        <SelectMes label="Mês inicial" name="mesInicioNorte" value={form.mesInicioNorte} />
                                        <SelectMes label="Mês final" name="mesFimNorte" value={form.mesFimNorte} />
                                    </div>
                                    <div className="regiao-meses">
                                        <h5>Nordeste</h5>
                                        <SelectMes label="Mês inicial" name="mesInicioNordeste" value={form.mesInicioNordeste} />
                                        <SelectMes label="Mês final" name="mesFimNordeste" value={form.mesFimNordeste} />
                                    </div>
                                    <div className="regiao-meses">
                                        <h5>Centro-Oeste</h5>
                                        <SelectMes label="Mês inicial" name="mesInicioCentroOeste" value={form.mesInicioCentroOeste} />
                                        <SelectMes label="Mês final" name="mesFimCentroOeste" value={form.mesFimCentroOeste} />
                                    </div>
                                    <div className="regiao-meses">
                                        <h5>Sudeste</h5>
                                        <SelectMes label="Mês inicial" name="mesInicioSudeste" value={form.mesInicioSudeste} />
                                        <SelectMes label="Mês final" name="mesFimSudeste" value={form.mesFimSudeste} />
                                    </div>
                                    <div className="regiao-meses">
                                        <h5>Sul</h5>
                                        <SelectMes label="Mês inicial" name="mesInicioSul" value={form.mesInicioSul} />
                                        <SelectMes label="Mês final" name="mesFimSul" value={form.mesFimSul} />
                                    </div>
                                </div>
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

export default CulturaCadastro;