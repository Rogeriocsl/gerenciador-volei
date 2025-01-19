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

      


    </Box>
  );
};

export default HomeAdmin;
