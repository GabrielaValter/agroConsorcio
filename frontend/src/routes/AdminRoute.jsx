import { Navigate } from "react-router-dom";

function AdminRoute({children}) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    if (usuario.tipoUsuario !== "ADMINISTRADOR") {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default AdminRoute