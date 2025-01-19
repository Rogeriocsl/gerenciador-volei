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
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Coluna da esquerda com a imagem de fundo */}
      <Box
        sx={{
          width: { xs: "100%", md: "70%" }, // 100% da largura em celulares, 70% em desktops
          height: "100vh", // Ajuste para garantir que ocupe a altura total da tela
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover", // Garante que a imagem cubra toda a área
          backgroundPosition: "center", // Centraliza a imagem
          backgroundRepeat: "no-repeat",
          backgroundAttachment: { xs: "scroll", md: "fixed" }, // Para criar um efeito de paralaxe em telas maiores
        }}
      />

      {/* Coluna da direita com o conteúdo */}
      <Box
        sx={{
          width: { xs: "100%", md: "70%" }, // 100% da largura em celulares, 30% em desktops
          height: "100vh", // Ajuste para garantir que ocupe a altura total da tela
          minHeight: "auto", // Ajuste para garantir que a box tenha altura suficiente em telas pequenas
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 3, md: 5 },
          backgroundColor: "#f5f5f5",
          marginLeft: { xs: 0, md: "auto" }, // Remove a margem em mobile e aplica margem automática em desktop
        }}
      >
        {/* Imagem redonda acima do título */}
        <img
          src={bolaImage}
          alt="Logo"
          style={{
            width: "100%",
            maxWidth: 240, // Reduzido para melhor exibição em dispositivos menores
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
            fontSize: { xs: 18, md: 24 }, // Ajuste dinâmico para telas menores
            marginBottom: 2,
            textAlign: "center",
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
            width: "100%",
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
              fontSize: { xs: 14, md: 16 }, // Ajuste dinâmico da fonte
              color: "#000",
              textAlign: "center",
              marginTop: 2, // Adicionando um pequeno espaço acima do link
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
