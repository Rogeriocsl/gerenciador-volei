import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { AddCircle, ListAlt, Block } from "@mui/icons-material"; // Ícones

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Função para navegação
  const handleNavigate = (path) => {
    navigate(path);
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
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Botão Registrar Participante */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              fullWidth
              sx={{
                height: 200,
                fontSize: "1.5rem",
                borderRadius: 3,
                textTransform: "none",
                backgroundColor: "#1976d2", // Tom esportivo
                '&:hover': {
                  backgroundColor: "#1565c0", // Efeito de hover
                },
                boxShadow: 3, // Sombra sutil
              }}
              onClick={() => handleNavigate("/registrar-participante")}
            >
              Registrar Participante
            </Button>
          </Grid>

          {/* Botão Listar Participantes */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ListAlt />}
              fullWidth
              sx={{
                height: 200,
                fontSize: "1.5rem",
                borderRadius: 3,
                textTransform: "none",
                backgroundColor: "#4caf50", // Tom esportivo
                '&:hover': {
                  backgroundColor: "#388e3c", // Efeito de hover
                },
                boxShadow: 3, // Sombra sutil
              }}
              onClick={() => handleNavigate("/listar-participantes")}
            >
              Listar Participantes
            </Button>
          </Grid>

          {/* Botão Participantes Inativos */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Block />}
              fullWidth
              sx={{
                height: 200,
                fontSize: "1.5rem",
                borderRadius: 3,
                textTransform: "none",
                backgroundColor: "#f44336", // Tom esportivo
                '&:hover': {
                  backgroundColor: "#d32f2f", // Efeito de hover
                },
                boxShadow: 3, // Sombra sutil
              }}
              onClick={() => handleNavigate("/participantes-inativos")}
            >
              Participantes Inativos
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeAdmin;
