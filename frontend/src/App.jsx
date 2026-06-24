import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import UsuarioCadastro from "./pages/UsuarioCadastro";
import UsuarioVisualizar from "./pages/UsuarioVisualizar";
import CulturaCadastro from "./pages/CulturaCadastro"
import CulturaVisualizar from "./pages/CulturaVisualizar";
import CatalogoCulturas from "./pages/CatalogoCulturas";
import Dashboard from "./pages/Dashboard";
import InformacaoCultura from "./pages/InformacaoCultura";
import ConsorcioCadastro from "./pages/ConsorcioCadastro";
import ConsorcioVisualizar from "./pages/ConsorcioVisualizar";
import JustificativaConsorcio from "./pages/JustificativaConsorcio";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/catalogoCulturas" element={<CatalogoCulturas />} />
        {/* <Route path="/objetivo" element={<Objetivo />} /> */}
        {/* <Route path="/sugestao" element={<Sugestao />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/informacaoCultura/:id" element={<InformacaoCultura />} />
        <Route path="/justificativaConsorcio/:id" element={<JustificativaConsorcio />} />

        {/* Apenas usuários logados */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/editarPerfil" element={<PrivateRoute><UsuarioCadastro /></PrivateRoute>}/>
        <Route path="/cadastroCultura" element={<PrivateRoute><CulturaCadastro /></PrivateRoute>}/>
        <Route path="/visualizarCultura" element={<PrivateRoute><CulturaVisualizar /></PrivateRoute>}/>
        <Route path="/editarCultura/:id" element={<PrivateRoute><CulturaCadastro /></PrivateRoute>}/>
        <Route path="/cadastroConsorcio" element={<PrivateRoute><ConsorcioCadastro /></PrivateRoute>}/>
        <Route path="/visualizarConsorcio" element={<PrivateRoute><ConsorcioVisualizar /></PrivateRoute>}/>
        <Route path="/editarConsorcio/:id" element={<PrivateRoute><ConsorcioCadastro /></PrivateRoute>}/>

        {/* Apenas administradores */}
        <Route path="/cadastroColaborador" element={<AdminRoute><UsuarioCadastro /></AdminRoute>} />
        <Route path="/editarPerfilColaborador/:id"element={<AdminRoute><UsuarioCadastro /></AdminRoute>}/>
        <Route path="/visualizarColaborador" element={<AdminRoute><UsuarioVisualizar /></AdminRoute>} />

      </Routes>
    </BrowserRouter> 
  );
}

export default App;