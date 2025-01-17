import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import backgroundImage from '../assets/background.png';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import bolaImage from '../assets/bola.png';

// Adiciona o link para a fonte Roboto no arquivo HTML (index.html)
import "@fontsource/roboto"; // Instalar e importar Roboto

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Para navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login realizado com sucesso!");
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

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
        <img
          src={bolaImage} // Substitua com o caminho da sua imagem
          alt="Logo"
          style={{
            width: 250,
            height: 250,
            borderRadius: "50%", // Para tornar a imagem redonda
            marginBottom: 20, // Espaçamento entre a imagem e o título
          }}
        />

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Login Admin
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
        </form>

        {/* Botão Voltar */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")} // Redireciona para a página de login participante
          sx={{ marginTop: 2 }}
        >
          Voltar para Login Participante
        </Button>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
