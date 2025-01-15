import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import backgroundImage from '../assets/background.png';
const Home = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,  // Substitua pelo caminho da sua imagem
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "white",  // Cor do texto, pode ser ajustada conforme o fundo
      }}
    >
      <Typography variant="h3" gutterBottom>
        Bem-vindo ao Gerenciador de Vôlei
      </Typography>
      <Typography variant="h6" paragraph>
        Escolha uma opção abaixo:
      </Typography>
      <Link to="/home-participante" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary">
          Ir para Home do Participante
        </Button>
      </Link>
    </Box>
  );
};

export default Home;
