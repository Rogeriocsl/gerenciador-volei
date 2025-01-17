import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import bolaImage from "../assets/bola.png";

import "@fontsource/roboto"; // Fonte Roboto

const HomeAdmin = () => {
 

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
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
          height: { xs: "40vh", md: "100vh" },
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
        <Box sx={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
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
          <Typography variant="h5" sx={{ marginBottom: 3 }}>
            Home Admin
          </Typography>
         
        </Box>
      </Box>
    </Box>
  );
};

export default HomeAdmin;
