import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { ArrowBack } from "@mui/icons-material"; // Ícone de seta para voltar
import { database } from "../firebase"; // Acesso ao banco Firebase (Realtime Database)
import { ref, set } from "firebase/database"; // Para adicionar dados no Realtime Database
import "@fontsource/roboto"; // Fonte Roboto

const RegistrarParticipante = () => {
    const navigate = useNavigate();

    // Estado para armazenar os dados do formulário
    const [nome, setNome] = useState("");
    const [contato, setContato] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [contatoResponsavel, setContatoResponsavel] = useState("");

    // Função para gerar um número de matrícula único de 8 dígitos
    const generateMatricula = () => {
        return Math.floor(10000000 + Math.random() * 90000000); // Gera um número de 8 dígitos
    };

    // Função para salvar o participante no Firebase (Realtime Database)
    const handleSubmit = async () => {
        try {
            const matricula = generateMatricula();
            const dataCriacao = new Date();
            const participanteRef = ref(database, "participantes/" + matricula); // Referência no banco de dados

            // Salvar os dados do participante
            await set(participanteRef, {
                nome,
                contato,
                dataNascimento,
                nomeResponsavel,
                contatoResponsavel,
                matricula, // Adiciona o número de matrícula
                inativo: false, // Campo inativo com valor padrão como false
                contribuiçõesMensais: [
                    {
                        mes: dataCriacao.getMonth() + 1,
                        ano: dataCriacao.getFullYear(),
                        valor: 0, // Valor inicial da contribuição
                    },
                ],
                dataCriacao, // Data de criação para referência das contribuições
            });

            alert("Participante registrado com sucesso!");
            navigate("/registrar-participante"); // Redireciona para a tela home-admin
        } catch (error) {
            console.error("Erro ao salvar participante:", error);
            alert("Erro ao registrar participante.");
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
                padding: 2,
            }}
        >
            {/* Botão de Voltar no canto superior esquerdo */}
            <Button
                onClick={() => navigate("/home-administrativo")}
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "#1976d2",
                    '&:hover': {
                        backgroundColor: "#1565c0",
                    },
                }}
            >
                <ArrowBack sx={{ fontSize: 30, color: "white" }} />
            </Button>

            {/* Título centralizado */}
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: "Roboto, sans-serif", // Usando a fonte Roboto
                    fontWeight: 700, // Peso da fonte para torná-la mais impactante
                    marginBottom: 4,
                    marginTop: 6, // Distância do topo ajustada
                    fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, // Fontes responsivas
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)", // Adicionando sombra no texto para efeito visual
                }}
            >
                Registrar Participante
            </Typography>

            {/* Formulário para registrar participante */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fundo semitransparente para o formulário
                    borderRadius: 3,
                    padding: 4,
                    width: "100%",
                    maxWidth: 500, // Máxima largura do formulário
                    marginTop: 5, // Distância do título
                    marginBottom: 3,
                    boxSizing: "border-box",
                }}
            >
                <TextField
                    label="Nome do Participante"
                    variant="outlined"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    fullWidth
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Contato"
                    variant="outlined"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    fullWidth
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Data de Nascimento"
                    variant="outlined"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    fullWidth
                    sx={{
                        marginBottom: 2,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Nome do Responsável"
                    variant="outlined"
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    fullWidth
                    sx={{
                        marginBottom: 2,
                    }}
                />
                <TextField
                    label="Contato do Responsável"
                    variant="outlined"
                    value={contatoResponsavel}
                    onChange={(e) => setContatoResponsavel(e.target.value)}
                    fullWidth
                    sx={{
                        marginBottom: 4,
                    }}
                />

                {/* Botão de Salvar */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        width: "100%",
                        padding: 2,
                    }}
                >
                    Salvar Participante
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrarParticipante;
