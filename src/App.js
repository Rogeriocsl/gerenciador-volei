import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginParticipante from "./pages/LoginParticipante";
import LoginAdmin from "./pages/LoginAdmin";
import HomeAdmin from "./pages/HomeAdmin";
import HomeParticipante from "./pages/HomeParticipante";
import RegistrarParticipante from "./pages/RegistrarParticipante";
import ListarParticipante from "./pages/ListarParticipante";
import ListarInativos from "./pages/ListarInativos";
import PrivateRoute from "./pages/PrivateRoute"; // Importando o PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginParticipante />} />
        <Route path="/login-administrativo" element={<LoginAdmin />} />
        <Route path="/home-participante" element={<HomeParticipante />} />

        {/* Rotas privadas */}
        <Route
          path="/home-administrativo"
          element={<PrivateRoute element={<HomeAdmin />} />}
        />
        <Route
          path="/listar-participantes"
          element={<PrivateRoute element={<ListarParticipante />} />}
        />
        <Route
          path="/listar-inativos"
          element={<PrivateRoute element={<ListarInativos />} />}
        />
        <Route
          path="/registrar-participante"
          element={<PrivateRoute element={<RegistrarParticipante />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
