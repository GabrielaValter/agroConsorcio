import { useState } from "react";
import "../styles/Login.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {IoArrowForward, IoEyeOutline, IoEyeOffOutline} from "react-icons/io5";

import {loginUsuario} from "../services/apiUsuario";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");

    const [senha, setSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {

        e.preventDefault();

        try {
            await loginUsuario(email, senha);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
    
            alert("Email ou senha inválidos");
        }
    }

    return (

        <div className="login-page">

            <Navbar tipo="login"/>

            <div className="login-container">

                {/* lado esquerdo da tela */}
                <div className="login-image">

                    <div className="overlay"></div>

                    <div className="info-login">

                        <h2>Espaço do Colaborador</h2>

                        <p className="text">
                            O acesso a esta área é exclusivo para colaboradores e administradore 
                            cadastrados. O login é necessário apenas para o gerenciamento 
                            (cadastro, edição e exclusão) de culturas e consórcios.
                        </p>

                    </div>

                    <div className="info-sugestao">

                        <h3>Não possuí uma conta?</h3>

                        <p className="text">
                            Você ainda pode contibuir com o projeto enviando sugestões de novas 
                            culturas ou consórcios para a nossa análise.
                        </p>

                        <button className="button-sugestao" onClick={() => navigate("/sugestao")}>
                            Enviar Sugestão 
                            <IoArrowForward />
                        </button>

                    </div>

                </div>

                {/* lado direito da tela */}
                <div className="login-content">
                    
                    <div className="login-box">
                            
                        <h2>Entrar</h2>

                        <p className="text-right">
                            Acesse sua conta para gerenciar culturas e consórcios
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="email" className="text-right1">Email</label>

                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                            <label htmlFor="email" className="text-right1">Senha</label>
                            
                            <div className="input-senha">

                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) =>
                                        setSenha(e.target.value)
                                    }
                                />

                                <button type="button" className="button-eye" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                    {mostrarSenha ? <IoEyeOutline /> : <IoEyeOffOutline />}
                                </button>
                            </div>

                            <button className="button-login" type="submit">
                                Entrar no Sistema 
                                <IoArrowForward />
                            </button>

                        </form>
                    
                    </div>
                
                </div>

            </div>

            <Footer />

        </div>
    );
}

export default Login;