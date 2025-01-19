import React from "react";
import { Link } from "react-router-dom";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";
import bolaImage from "../assets/bola.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import "@fontsource/roboto"; // Fonte Roboto

const LoginParticipante = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Coluna única em telas menores, lado a lado em maiores
      }}
    >
      {/* Coluna da esquerda com a imagem de fundo */}
      <Box
        sx={{
          width: { xs: "100%", md: "70%" }, // 100% da largura em celulares, 70% em desktops
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: { xs: "40vh", md: "100vh" }, // Altura menor para celulares
        }}
      />

      {/* Coluna da direita com o conteúdo */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" }, // 100% em celulares, 30% em desktops
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, md: 5 },
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Imagem redonda acima do título */}
        <img
          src={bolaImage}
          alt="Logo"
          style={{
            width: "100%",
            maxWidth: 150, // Largura menor para celulares
            height: "auto",
            borderRadius: "50%",
            marginBottom: 20,
          }}
        />

        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: { xs: 18, md: 24 }, // Fonte ajustada para diferentes tamanhos de tela
            marginBottom: 2,
          }}
        >
          Bem-vindo ao Gerenciador de Vôlei
        </Typography>

        {/* Campo de Matrícula */}
        <TextField
          label="Matrícula"
          variant="filled"
          placeholder="Digite sua matrícula"
          fullWidth
          sx={{
            maxWidth: 300,
            backgroundColor: "#fff",
            borderRadius: 2,
            marginBottom: 3,
          }}
        />

        {/* Botão de ação */}
        <Link to="/home-participante" style={{ textDecoration: "none" }}>
          <IconButton
            color="primary"
            sx={{
              width: 60,
              height: 60,
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50%",
              marginBottom: 2,
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Link>

        {/* Link para Login Administrativo */}
        <Link to="/login-administrativo" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: { xs: 14, md: 16 }, // Fonte ajustada para responsividade
              color: "#000",
            }}
          >
            Login Administrativo
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default LoginParticipante;
