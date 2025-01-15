import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Página principal
import HomeParticipante from "./pages/HomeParticipante"; // Nova página

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página inicial */}
        <Route path="/home-participante" element={<HomeParticipante />} /> {/* Nova página */}
      </Routes>
    </Router>
  );
}

export default App;
