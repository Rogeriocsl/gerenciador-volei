import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Snackbar, SnackbarContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import backgroundImage from "../assets/background.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import bolaImage from "../assets/bola.png";

import "@fontsource/roboto"; // Fonte Roboto

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para armazenar a mensagem de erro
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controle para mostrar a Snackbar
  const navigate = useNavigate(); // Para navegação

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validações simples de email e senha
    if (!email || !password) {
      setError("Email e senha são obrigatórios.");
      setOpenSnackbar(true);
      return;
    }

    setError(""); // Limpa o erro anterior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home-administrativo");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      let errorMessage = "Erro desconhecido.";
      if (error.code) {
        console.log("Código do erro:", error.code);
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Email inválido. Verifique o endereço de email.";
            break;
          case "auth/user-not-found":
            errorMessage = "Usuário não encontrado. Verifique seu email.";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta. Tente novamente.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
            break;
          case "auth/invalid-credential":
            errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
            break;
          default:
            errorMessage = "Erro desconhecido. Tente novamente mais tarde.";
        }
      }

      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Fecha o Snackbar quando o usuário interagir
  };

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
          <Typography
            variant="h5"
            sx={{
              marginBottom: 3,
              fontFamily: '"Roboto", sans-serif' // Aplicando a fonte Roboto
            }}
          >
            Bem-vindo ao Gerenciador de Vôlei
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Senha"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ marginBottom: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              Entrar
            </Button>
          </form>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
            fullWidth
          >
            Voltar para Login Participante
          </Button>
        </Box>
      </Box>

      {/* Snackbar para mostrar a mensagem de erro */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          sx={{
            backgroundColor: "red", // Fundo vermelho
            color: "white", // Texto branco
            borderRadius: 1,
            padding: 2,
          }}
          message={error}
          autoHideDuration={4000}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Box>
  );
};

export default LoginAdmin;
