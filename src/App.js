import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoginParticipante from "./pages/LoginParticipante";
import LoginAdmin from "./pages/LoginAdmin";
import HomeAdmin from "./pages/HomeAdmin";
import HomeParticipante from "./pages/HomeParticipante";
import RegistrarParticipante from "./pages/RegistrarParticipante";
import ListarParticipante from "./pages/ListarParticipante";
import ListarInativos from "./pages/ListarInativos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginParticipante />} />
        <Route path="/home-participante" element={<HomeParticipante />} />
        <Route path="/listar-participantes" element={<ListarParticipante />} />
        <Route path="/listar-inativos" element={<ListarInativos />} />
        <Route path="/registrar-participante" element={<RegistrarParticipante />} />
        <Route path="/login-administrativo" element={<LoginAdmin />} />
        <Route path="/home-administrativo" element={<HomeAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
