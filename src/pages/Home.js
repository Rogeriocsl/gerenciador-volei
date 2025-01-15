import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Gerenciador de Vôlei</h1>
      <p>Escolha uma opção abaixo:</p>
      <Link to="/home-participante">Ir para Home do Participante</Link>
    </div>
  );
};

export default Home;
