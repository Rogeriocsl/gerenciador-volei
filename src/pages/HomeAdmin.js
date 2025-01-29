import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { PersonAdd, ListAlt, Block, ExitToApp } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Estilos compartilhados para os botões
const buttonStyles = {
  width: 200,
  height: 200,
  fontSize: "1rem",
  borderRadius: 3,
  textTransform: "none",
  boxShadow: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: 2,
  '& .MuiSvgIcon-root': {
    fontSize: "6rem !important", // Força o tamanho do ícone
  },
  '&:hover': {
    opacity: 0.9,
  },
};

// Componente reutilizável para os botões
const ActionButton = ({ icon: Icon, label, color, onClick }) => (
  <Button
    variant="contained"
    color={color}
    startIcon={<Icon sx={{ fontSize: "6rem" }} />} // Tamanho do ícone definido explicitamente
    sx={{
      ...buttonStyles,
      backgroundColor: color === "error" ? "#f44336" : color === "secondary" ? "#4caf50" : "#00f",
      '&:hover': {
        backgroundColor: color === "error" ? "#d32f2f" : color === "secondary" ? "#388e3c" : "#2510a3",
      },
    }}
    onClick={onClick}
  >
    {label}
  </Button>
);

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Função para navegação
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login-administrativo");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
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
            backgroundColor: "#f44336",
            '&:hover': {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          <ExitToApp sx={{ fontSize: 30 }} />
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
          {/* Botões reutilizáveis */}
          <ActionButton
            icon={PersonAdd}
            label="Registrar Participante"
            color="primary"
            onClick={() => handleNavigate("/registrar-participante")}
          />
          <ActionButton
            icon={ListAlt}
            label="Listar Participantes"
            color="secondary"
            onClick={() => handleNavigate("/listar-participantes")}
          />
          <ActionButton
            icon={Block}
            label="Participantes Inativos"
            color="error"
            onClick={() => handleNavigate("/participantes-inativos")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomeAdmin;