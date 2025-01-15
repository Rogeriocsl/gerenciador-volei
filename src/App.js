import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HomeParticipante from "./pages/HomeParticipante";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-participante" element={<HomeParticipante />} />
      </Routes>
    </Router>
  );
}

export default App;
