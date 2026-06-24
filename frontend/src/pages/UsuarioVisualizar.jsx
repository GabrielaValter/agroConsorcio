import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/visualizar/Visualizar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePaginacao } from "../utils/paginacao";
import { listarColaboradores, buscarColaborador, excluirColaborador } from "../services/apiUsuario";
import { IoCreateOutline, IoTrashOutline, IoSearchOutline } from "react-icons/io5";

function UsuarioVisualizar() {
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const {paginaAtual, totalPaginas, itensPaginados: usuariosPaginados, proximaPagina, paginaAnterior, voltarPrimeiraPagina} = usePaginacao(usuarios, 15);

    useEffect(() => {
        carregarColaboradores();
    }, []);

    async function carregarColaboradores() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await listarColaboradores();
            setUsuarios(resposta);
            voltarPrimeiraPagina();
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar colaboradores.");
        } finally {
            setCarregando(false);
        }
    }

    async function pesquisarColaborador() {
        try {
            setErro("");
            if (!buscar.trim()) {
                await carregarColaboradores();
                return;
            }
            const resposta = await buscarColaborador(buscar);
            setUsuarios(resposta);
            voltarPrimeiraPagina();
        } catch (error) {
            console.error(error);
            setErro("Erro ao buscar colaborador");
        }        
    }

    function editarColaborador(usuario) {
        navigate(`/editarPerfilColaborador/${usuario.idUsuario}`, {
            state: { usuario }
        });
    }

    async function deletarColaborador(usuario) {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir ${usuario.nomeUsuario}?`
        )
        if (!confirmar) {
            return;
        }

        try {
            await excluirColaborador(usuario.idUsuario);
            
            setUsuarios((usuariosAtuais) => usuariosAtuais.filter((item) => item.idUsuario !== usuario.idUsuario));

            alert("Colaborador excluído com sucesso!");
        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao excluir colaborador");
        }
    }
    
    return (
        <div className="visualizar-page">
            <Navbar />

            <div className="visualizar-container">

                <div className="visualizar-header">
                    <h2>Lista de Colaboradores Cadastrados</h2>
                    
                    <div className="acoes-header">
                        <button className="button-adicionar" onClick={() => navigate("/cadastroColaborador")}>
                            + Novo Colaborador
                        </button>
                    </div>
                </div>

                <div className="barra-busca-container">
                    <div className="barra-busca">
                        <IoSearchOutline className="icone-busca" />
                        <input type="text" placeholder="Buscar por nome ou email" value={buscar} onChange={(e) => setBuscar(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                pesquisarColaborador();
                            }
                        }} />
                        <button className="button-buscar" onClick={pesquisarColaborador}>Buscar</button>
                    </div>
                </div>


                <div className="visualizar-card">
                    {carregando && <p className="mensagem">Carregando colaboradores...</p>}

                    {erro && <p className="erro">{erro}</p>}

                    {!carregando && !erro && usuarios.length === 0 && (
                        <p className="mensagem">Nenhum colaborador cadastrado.</p>
                    )}

                    {!carregando && !erro && usuarios.length > 0 && (
                        <>
                            <div className="tabela-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome Completo</th>
                                            <th className="campo-email">Email</th>
                                            <th>Telefone</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {usuariosPaginados.map((usuario) => (
                                            <tr key={usuario.idUsuario}>
                                                <td>{usuario.nomeUsuario}</td>
                                                <td className="campo-email">{usuario.email}</td>
                                                <td>{usuario.telefone || "-"}</td>
                                                <td>
                                                    <div className="acoes">
                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Editar</span>
                                                            <button className="buttonEditar" onClick={() => editarColaborador(usuario)} title="Editar">
                                                                <IoCreateOutline />
                                                            </button> 
                                                        </div>
                                                        <div className="tooltip-icone">
                                                            <span className="mensagem-icone">Excluir</span>
                                                            <button className="buttonExcluir" onClick={() => deletarColaborador(usuario)} title="Excluir">
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

export default UsuarioVisualizar;