import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { AddCircle, ListAlt, Block, ExitToApp, PersonAdd } from "@mui/icons-material"; // Ícones

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Função para navegação
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desconecta o usuário do Firebase
      navigate("/login-administrativo"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Botão de Logout no canto superior esquerdo */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            borderRadius: "50%",
            padding: 2,
            marginBottom: 1,
            backgroundColor: "#f44336", // Cor de fundo vermelha para logout
            '&:hover': {
              backgroundColor: "#d32f2f", // Efeito de hover
            },
          }}
        >
          <ExitToApp sx={{ fontSize: 30 }} /> {/* Ícone de sair */}
        </Button>
        <Typography variant="caption" sx={{ color: "#3c3c3c", fontWeight: "bold" }}>
          Logout
        </Typography>
      </Box>

      {/* Coluna da direita com os botões */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
            maxWidth: "90%",
            width: 800,
          }}
        >
          {/* Botão Registrar Participante */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAdd  sx={{ fontSize: "3rem" }}/>} // Ícone maior
            sx={{
              width: 200,
              height: 200,
              fontSize: "1rem",
              borderRadius: 3,
              textTransform: "none",
              backgroundColor: "#1976d2", // Tom esportivo
              '&:hover': {
                backgroundColor: "#1565c0", // Efeito de hover
              },
              boxShadow: 3, // Sombra sutil
              display: "flex",
              flexDirection: "column", // Organiza o ícone em cima do texto
              justifyContent: "center", // Centraliza o conteúdo
              alignItems: "center", // Centraliza o conteúdo
              padding: 2, // Padding para ajustar o espaço
              '& .MuiSvgIcon-root': { // Estiliza o ícone dentro do botão
                fontSize: "6rem"
               }
            }}
            onClick={() => handleNavigate("/registrar-participante")}
          >
            Registrar Participante
          </Button>

          {/* Botão Listar Participantes */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ListAlt sx={{ fontSize: "3rem" }} />}
            sx={{
              width: 200,
              height: 200,
              fontSize: "1.1rem",
              borderRadius: 3,
              textTransform: "none",
              backgroundColor: "#4caf50", // Tom esportivo
              '&:hover': {
                backgroundColor: "#388e3c", // Efeito de hover
              },
              boxShadow: 3, // Sombra sutil
              display: "flex",
              flexDirection: "column", // Organiza o ícone em cima do texto
              justifyContent: "center", // Centraliza o conteúdo
              alignItems: "center", // Centraliza o conteúdo
              padding: 2,
              '& .MuiSvgIcon-root': { // Estiliza o ícone dentro do botão
                fontSize: "6rem"
               } // 
            }}
            onClick={() => handleNavigate("/listar-participantes")}
          >
            Listar Participantes
          </Button>

          {/* Botão Participantes Inativos */}
          <Button
            variant="contained"
            color="error"
            startIcon={<Block />}
            sx={{
              width: 200,
              height: 200,
              fontSize: "1rem",
              borderRadius: 3,
              textTransform: "none",
              backgroundColor: "#f44336", // Tom esportivo
              '&:hover': {
                backgroundColor: "#d32f2f", // Efeito de hover
              },
              boxShadow: 3, // Sombra sutil
              display: "flex",
              flexDirection: "column", // Organiza o ícone em cima do texto
              justifyContent: "center", // Centraliza o conteúdo
              alignItems: "center", // Centraliza o conteúdo
              padding: 2, // Padding para ajustar o espaço
              '& .MuiSvgIcon-root': { // Estiliza o ícone dentro do botão
                fontSize: "6rem", // Ajusta o tamanho do ícone
              }
            }}
            onClick={() => handleNavigate("/participantes-inativos")}
          >
            Participantes Inativos
          </Button>


        </Box>
      </Box>
    </Box>
  );
};

export default HomeAdmin;
