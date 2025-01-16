import React from "react";
import { Link } from "react-router-dom";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import backgroundImage from '../assets/background.png';
import bolaImage from '../assets/bola.png';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Adiciona o link para a fonte Roboto no arquivo HTML (index.html)
import "@fontsource/roboto";  // Instalar e importar Roboto

const Home = () => {
  return (
    <Box
      sx={{
        height: "100vh", // Garante que ocupe toda a altura da janela
        display: "flex",
        flexDirection: "row", // Coloca as colunas lado a lado
      }}
    >
      {/* Coluna da esquerda com a imagem de fundo */}
      <Box
        sx={{
          width: "70%", // Metade da tela
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Coluna da direita com o conteúdo */}
      <Box
        sx={{
          width: "30%", // 30% da largura da tela para o conteúdo
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly", // Distribui igualmente os itens
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#f5f5f5", // Cor de fundo para a parte direita
          padding: 3,
        }}
      >
        {/* Foto acima do título */}
        <img
          src={bolaImage} // Substitua com o caminho da sua imagem
          alt="Logo"
          style={{
            width: 250,
            height: 250,
            borderRadius: "50%",  // Para tornar a imagem redonda
            marginBottom: 20, // Espaçamento entre a imagem e o título
          }}
        />
        
        {/* Título com a fonte Roboto e tamanho 20px */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Roboto', sans-serif", // Aplica a fonte Roboto
            fontSize: 20, // Define o tamanho da fonte para 20px
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
            backgroundColor: "#fff", // Cor de fundo do input
            color: "#000", // Cor do texto
            borderRadius: 2,
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
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
