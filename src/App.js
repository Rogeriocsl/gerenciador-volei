import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoginParticipante from "./pages/LoginParticipante";
import LoginAdmin from "./pages/LoginAdmin";
import HomeParticipante from "./pages/HomeParticipante";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginParticipante />} />
        <Route path="/home-participante" element={<HomeParticipante />} />
        <Route path="/login-administrativo" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
