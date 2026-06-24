import { useEffect, useRef, useState  } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { IoArrowBack, IoChevronDown, IoMenu } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";

function Navbar({tipo}) {

    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const [menuCentroAberto, setMenuCentroAberto] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        function fecharMenu(event) {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setMenuCentroAberto(false);
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", fecharMenu);

        return () => {document.removeEventListener("mousedown", fecharMenu);};
    }, []);

    function logout() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (tipo === "login") {
        return (
            <nav className="navbar" ref={navbarRef}>
                <div className="logo">
                    AgroConsórcio
                </div>
                <button className="button-voltar-navi" onClick={() => navigate("/catalogoCulturas")}>
                    <IoArrowBack />
                    Voltar  
                </button> 
            </nav>
        )
    }

    const primeiroNome = usuario?.nomeUsuario?.split(" ")[0];


    return (
        <nav className="navbar" ref={navbarRef}>

            <button className="button-menu-centro" onClick={() => setMenuCentroAberto(!menuCentroAberto)}>
                <IoMenu />
            </button>

            <div className="logo">AgroConsórcio</div>

            <div className={menuCentroAberto ? "centro centroAberto" : "centro"}>
                <ul className="menu">
                    <li>
                        <NavLink to="/catalogoCulturas" onClick={() => setMenuCentroAberto(false)} className={({isActive}) => isActive ? "menu-link ativo" : "menu-link"}>
                            Catálogo
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/objetivo" onClick={() => setMenuCentroAberto(false)} className={({isActive}) => isActive ? "menu-link ativo" : "menu-link"}>
                            Objetivo
                        </NavLink>
                    </li> */}

                    {
                        !usuario && (
                            <li>
                                <NavLink to="/sugestao" onClick={() => setMenuCentroAberto(false)} className={({isActive}) => isActive ? "menu-link ativo" : "menu-link"}>
                                    Sugestão
                                </NavLink>
                            </li>
                        )
                    }
                    {
                        usuario?.tipoUsuario === "COLABORADOR" && (
                            <li>
                                <NavLink to="/dashboard" onClick={() => setMenuCentroAberto(false)} className={({isActive}) => isActive ? "menu-link ativo" : "menu-link"}>
                                    Área do Colaborador
                                </NavLink>
                            </li>
                        )
                    }
                    {
                        usuario?.tipoUsuario === "ADMINISTRADOR" && (
                            <li>
                                <NavLink to="/dashboard" onClick={() => setMenuCentroAberto(false)} className={({isActive}) => isActive ? "menu-link ativo" : "menu-link"}>
                                    Área do Administrador
                                </NavLink>
                            </li>
                        )
                    }

                </ul>
            </div>

            {
                !usuario ? (
                    <button className="button-entrar" onClick={() => navigate("/login")}>
                        Entrar
                    </button>
                ) : (
                    <div className="usuario-wrapper">
                        <button className="usuario" onClick={() => setMenuAberto(!menuAberto)}>
                            <HiOutlineUser className="icone-usuario"/>
                            <span>{primeiroNome}</span>
                            <IoChevronDown className={menuAberto ? "seta aberta" : "seta"} />
                        </button>
                        {menuAberto &&(
                            <div className="menu-usuario">
                                <button onClick={() => navigate("/editarPerfil")}>
                                    Editar perfil
                                </button>
                                <button onClick={logout}>
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                )
            }

        </nav>
    )
}

export default Navbar;