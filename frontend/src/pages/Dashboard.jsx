import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoArrowForward } from "react-icons/io5";

function Dashboard() {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        navigate("/login");
        return null;
    }

    return (

        <div className="dashboard-page">

            <Navbar />

            <div className="dashboard-container">

                <div className="dashboard-header">
                    <h3>Cadastros e Gerenciamentos do Sistema</h3>
                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-card" onClick={() => navigate("/cadastroCultura")}>
                        <div className="text">
                            <h3>Cadastrar nova cultura</h3>
                            <p>
                                Faça o cadastro de uma cultura por vez, inserindo todos os dados essenciais do vegetal
                            </p>
                        </div>
                        <div className="card-arrow">
                            <IoArrowForward />
                        </div>
                    </div>

                    <div className="dashboard-card" onClick={() => navigate("/visualizarCultura")}>
                        <div className="text">
                            <h3>Ver todas as culturas cadastradas</h3>
                            <p>
                                Visualizar todas as culturas cadastradas no sistema, podendo editar ou excluir se necessário
                            </p>
                        </div>
                        <div className="card-arrow">
                            <IoArrowForward />
                        </div>
                    </div>

                    <div className="dashboard-card" onClick={() => navigate("/cadastroConsorcio")}>
                        <div className="text">
                            <h3>Cadastrar novo consórcio</h3>
                            <p>
                                Use duas ou mais culturas já cadastradas para cadastrar elas como amigas ou inimigas, mostrando
                                justificativa e observações para o plantio consorciado
                            </p>
                        </div>
                        <div className="card-arrow">
                            <IoArrowForward />
                        </div>
                    </div>

                    <div className="dashboard-card" onClick={() => navigate("/visualizarConsorcio")}>
                        <div className="text">
                            <h3>Ver todos os consórcios cadastrados</h3>
                            <p>
                                Visualizar todos os consórcios cadastrados no sistema, podendo editar ou excluir se necessário
                            </p>
                        </div>
                        <div className="card-arrow">
                            <IoArrowForward />
                        </div>
                    </div>

                    {
                        usuario.tipoUsuario === "ADMINISTRADOR" && (
                            <>
                                <div className="dashboard-card" onClick={() => navigate("/cadastroColaborador")}>
                                    <div className="text">
                                        <h3>Cadastrar novo colaborador</h3>
                                        <p>
                                            Cadastre um novo colaborador para que ele possa cadastrar e gerenciar culturas e consórcios, 
                                            determine o e-mail e a senha e depois envie para o novo colaborador para que ele possa acessar a conta
                                        </p>
                                    </div>  
                                    <div className="card-arrow">
                                        <IoArrowForward />
                                    </div>  
                                </div>
                              

                                <div className="dashboard-card" onClick={() => navigate("/visualizarColaborador")}>
                                    <div className="text">
                                        <h3>Ver todos os colaboradores cadastrados</h3>
                                        <p>
                                            Visualizar todos os colaboradores cadastrados no sistema, podendo 
                                            editar ou excluir se necessário
                                        </p>
                                    </div>
                                    <div className="card-arrow">
                                        <IoArrowForward />
                                    </div> 
                                </div>
                            </>  
                        )
                    }





                </div>


            </div>



            <Footer />

        </div>
    );
}

export default Dashboard;