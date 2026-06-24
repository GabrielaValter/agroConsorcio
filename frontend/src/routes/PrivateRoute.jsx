import { Navigate } from "react-router-dom";

function PrivateRoute({children}) {
    
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;