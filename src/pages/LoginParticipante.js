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
        flexDirection: { xs: "column", md: "row" }, // Colunas lado a lado em telas maiores
      }}
    >
      {/* Coluna da esquerda com a imagem de fundo */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: { xs: "40vh", md: "100vh" }, // Ajuste para telas pequenas
        }}
      />

      {/* Coluna da direita com o conteúdo */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 3, md: 5 },
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Imagem redonda acima do título */}
        <img
          src={bolaImage}
          alt="Logo"
          style={{
            width: "100%",
            maxWidth: 200,
            borderRadius: "50%",
            marginBottom: 20,
          }}
        />

        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: { xs: 18, md: 24 }, // Ajusta o tamanho da fonte
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
            color: "#000",
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
                backgroundColor: "#444", // Efeito de hover
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
              fontSize: { xs: 14, md: 16 },
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
