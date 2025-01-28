import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, IconButton, Typography, Button, Snackbar } from "@mui/material";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import backgroundImage from "../assets/background.png";
import bolaImage from "../assets/bola.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import "@fontsource/roboto"; // Fonte Roboto

const LoginParticipante = () => {
  const [matricula, setMatricula] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const navigate = useNavigate();

  // Função para verificar a matrícula
  const handleLogin = async () => {
    if (!matricula.trim()) {
      setSnackbarMessage("Por favor, insira sua matrícula.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const snapshot = await get(ref(database, `participantes/${matricula}`));
      if (snapshot.exists()) {
        navigate(`/home-participante`, { state: { matricula } }); // Redireciona e passa a matrícula como estado
      } else {
        setSnackbarMessage("Matrícula não encontrada. Verifique os dados.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erro ao verificar matrícula:", error);
      setSnackbarMessage("Erro ao realizar o login. Tente novamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };


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
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          fullWidth
          sx={{
            maxWidth: 300,
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            marginBottom: 3,
          }}
        />

        <IconButton
          color="primary"
          onClick={handleLogin}
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


        {/* Link para Login Administrativo */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/login-administrativo")}
          
        >
          Login Administrativo
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          ContentProps={{
            style: { backgroundColor: snackbarSeverity === "success" ? "green" : "red" },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginParticipante;
