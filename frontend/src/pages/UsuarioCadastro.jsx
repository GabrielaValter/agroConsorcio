import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/cadastro/Cadastro.css"
import "../styles/cadastro/UsuarioCadastro.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoEyeOutline, IoEyeOffOutline, IoInformationCircleOutline } from "react-icons/io5";
import { HiXMark, HiCheck } from "react-icons/hi2";

import { cadastrarUsuario, editarUsuario } from "../services/apiUsuario";

function UsuarioCadastro() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

    const cadastro = location.pathname === "/cadastroColaborador";
    const editarPerfil = location.pathname === "/editarPerfil";
    const editarColaborador = location.pathname.startsWith("/editarPerfilColaborador");

    const usuarioRecebido = location.state?.usuario;
    const modoEdicao = editarPerfil || editarColaborador;
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");    
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

    const [erros, setErros] = useState({});

    useEffect(() => {
        if (editarPerfil && usuarioLogado) {
            setNomeUsuario(usuarioLogado.nomeUsuario || "");
            setEmail(usuarioLogado.email || "");
            setTelefone(usuarioLogado.telefone || "");
        }
        if (editarColaborador && usuarioRecebido) {
            setNomeUsuario(usuarioRecebido.nomeUsuario || "");
            setEmail(usuarioRecebido.email || "");
            setTelefone(usuarioRecebido.telefone || "");
        }
        setSenha("");
        setConfirmarSenha("");
        setSenhaAtual("");
    }, []);

    function definirTitulo() {
        if (cadastro) {
            return "Cadastrar novo colaborador";
        }
        if (editarPerfil) {
            return "Editar meu perfil"
        }
        if (editarColaborador) {
            if (nomeUsuario) {
                return `Editar perfil de ${nomeUsuario}`;
            }
            return "Editar perfil do colaborador";
        }
        return "Usuário";
    }

    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <=2) {
            return numeros;
        }
        if (numeros.length <= 7) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`; 
        }
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }

    function validarFormulario() {
        const novosErros = {};

        if (!nomeUsuario.trim()) {
            novosErros.nomeUsuario = "O nome é obrigatório";
        }
        if (!email.trim()) {
            novosErros.email = "O email é obrigatório";
        } else if (!emailRegex.test(email)) {
            novosErros.email = "O email digitado é inválido"
        }
        if (telefone && telefone.length !== 15) {
            novosErros.telefone = "Use o formato de telefone (99) 99999-9999";
        }
        if (editarPerfil && !senhaAtual.trim()) {
            novosErros.senhaAtual = "Informe sua senha atual para salvar as alterações";
        }
        if (!modoEdicao && !senha.trim()) {
            novosErros.senha = "A senha é obrigatória";
        } else if (senha && senha.length < 8) {
            novosErros.senha = "A senha deve possuir pelo menos 8 caracteres";
        }
        if (!modoEdicao && !confirmarSenha.trim()) {
            novosErros.confirmarSenha = "A confirmação de senha é obrigatória";
        }
        if (senha || confirmarSenha) {
            if (senha !== confirmarSenha) {
                novosErros.confirmarSenha = "As senhas não são iguais"
            }
        }
        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    }

    function cancelarFormulario() {
        const mensagem = modoEdicao
        ? "Tem certeza que deseja cancelar? Os dados alterados não serão salvos."
        : "Tem certeza que deseja cancelar? Os dados preenchidos serão perdidos.";
        const confirmar = window.confirm(mensagem);
        
        if (confirmar) {
            setNomeUsuario("");
            setEmail("");
            setTelefone("");
            setSenha("");
            setConfirmarSenha("");
            setErros({});
            navigate("/visualizarColaborador");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }
        
        try {
            if (cadastro) {
                const usuario = {
                    nomeUsuario,
                    email,
                    senha,
                    confirmarSenha,
                    telefone
                };

                await cadastrarUsuario(usuario);

                setNomeUsuario("");
                setEmail("");
                setTelefone("");
                setSenha("");
                setConfirmarSenha("");
                setErros({});

                alert("Colaborador cadastrado com sucesso!");
                navigate("/visualizarColaborador");
            }
            if (modoEdicao) {
                const idUsuario = editarPerfil? usuarioLogado.idUsuario: id;

                const usuarioEditado = {
                    nomeUsuario,
                    email,
                    telefone,
                    senhaAtual,
                    novaSenha: senha,
                    confirmarNovaSenha: confirmarSenha,
                }

                const resposta = await editarUsuario(idUsuario, usuarioEditado);

                if (editarPerfil) {
                    localStorage.setItem("usuario", JSON.stringify(resposta));
                }

                alert("Usuário editado com sucesso!");
                navigate("/visualizarColaborador");
            }
        } catch (error) {
            console.error(error);

            if (error.message.toLowerCase().includes("email")) {
                alert("Já existe um usuário com este email.");
                return;
            }

            alert(error.message || "Erro ao salvar usuário");
        }
    }

    return (

        <div className="cadastro-page">

            <Navbar/>

            <div className="cadastro-container">

                <h2>{definirTitulo()}</h2>

                <div className="cadastro-card">

                    <form onSubmit={handleSubmit}>

                        <label>Nome completo <span className="obrigatorio">*</span></label>
                        <input type="text" placeholder="Ex: João Silva" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} />
                        {erros.nomeUsuario && <p className="erro">{erros.nomeUsuario}</p>}

                        <label>Email <span className="obrigatorio">*</span>
                            <span className="tooltip-container">
                                <IoInformationCircleOutline className="icone-info" />
                                <span className="tooltip-text">
                                    O email deve ser único no sistema
                                </span>
                            </span>
                        </label>
                        <input type="text" placeholder="Ex: joao@email.com" value={email} autoComplete="off" name="emailUsuario" onChange={(e) => setEmail(e.target.value)} />
                        {erros.email && <p className="erro">{erros.email}</p>}

                        <label>Telefone</label>
                        <input type="text" placeholder="Ex: (00) 00000-0000" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} />
                        {erros.telefone && <p className="erro">{erros.telefone}</p>}

                        {editarPerfil && (
                            <>
                                <label>Senha atual <span className="obrigatorio">*</span>
                                    <span className="tooltip-container">
                                        <IoInformationCircleOutline className="icone-info" />
                                        <span className="tooltip-text">
                                            Para fazer qualquer alteração é preciso confirmar sua senha atual
                                        </span>
                                    </span>
                                </label>
                                <div className="campo-senha">
                                    <input type={mostrarSenhaAtual ? "text" : "password"} placeholder="Digite sua senha atual" value={senhaAtual} autoComplete="current-password" name="senhaAtual" onChange={(e) => setSenhaAtual(e.target.value)} />
                                    <button type="button" onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>
                                        {mostrarSenhaAtual ? <IoEyeOutline /> : <IoEyeOffOutline />}
                                    </button>
                                </div>
                                {erros.senhaAtual && <p className="erro">{erros.senhaAtual}</p>}
                            </>
                        )}

                        <label>{modoEdicao ? "Nova senha" : "Senha"} 
                            {!modoEdicao && <span className="obrigatorio">*</span>}
                            <span className="tooltip-container">
                                <IoInformationCircleOutline className="icone-info" />
                                <span className="tooltip-text">
                                    Para alterar a senha atual é necessário preencher o campo 'Nova senha' e confirmar a senha no campo 'Confirme a nova senha', caso não queira alterar a senha apenas deixe os campos em branco
                                </span>
                            </span>
                        </label>
                        <div className="campo-senha">
                            <input type={mostrarSenha ? "text" : "password"} placeholder="Digite a nova senha" value={senha} autoComplete="new-password" name="novaSenha" onChange={(e) => setSenha(e.target.value)} />
                            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                {mostrarSenha ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </button>
                        </div>
                        {erros.senha && <p className="erro">{erros.senha}</p>}

                        <label>
                            {modoEdicao ? "Confirme a nova senha" : "Confirme a senha"}
                            {!modoEdicao && <span className="obrigatorio">*</span>}
                        </label>
                        <div className="campo-senha">
                            <input type={mostrarConfirmarSenha ? "text" : "password"} placeholder="Confirme a nova senha" value={confirmarSenha} autoComplete="new-password" name="confirmarNovaSenha" onChange={(e) => setConfirmarSenha(e.target.value)} />
                            <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                                {mostrarConfirmarSenha ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </button>
                        </div>
                        {erros.confirmarSenha && <p className="erro">{erros.confirmarSenha}</p>}

                        <div className="botoes-formulario">
                            <button type="button" className="button-cancelar" onClick={cancelarFormulario}>
                                <HiXMark />
                                Cancelar
                            </button>

                            <button className="button-salvar" type="submit">
                                <HiCheck />
                                Salvar
                            </button>
                        </div>

                    </form>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default UsuarioCadastro;