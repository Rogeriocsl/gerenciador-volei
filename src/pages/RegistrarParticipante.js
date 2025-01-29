import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Snackbar, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import backgroundImage from "../assets/background.png";
import { ArrowBack } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import "@fontsource/roboto";

const RegistrarParticipante = () => {
    const navigate = useNavigate();

    // Estado para armazenar os dados do formulário
    const [nome, setNome] = useState("");
    const [contato, setContato] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [contatoResponsavel, setContatoResponsavel] = useState("");
    const [turma, setTurma] = useState(""); // Estado para a turma

    // Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Função para gerar um número de matrícula único de 8 dígitos
    const generateMatricula = () => {
        return Math.floor(10000000 + Math.random() * 90000000);
    };

    // Função para salvar o participante no Firebase
    const handleSubmit = async () => {
        // Verifica se todos os campos estão preenchidos
        if (!nome || !contato || !dataNascimento || !nomeResponsavel || !contatoResponsavel || !turma) {
            setSnackbarMessage("Por favor, preencha todos os campos e selecione a turma!");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        try {
            const matricula = generateMatricula();
            const dataCriacao = new Date();
            const participanteRef = ref(database, "participantes/" + matricula);

            // Salvar os dados do participante
            await set(participanteRef, {
                nome,
                contato,
                dataNascimento,
                nomeResponsavel,
                contatoResponsavel,
                turma, // Adiciona a turma selecionada
                matricula,
                inativo: false,
                contribuiçõesMensais: [
                    {
                        mes: dataCriacao.getMonth() + 1,
                        ano: dataCriacao.getFullYear(),
                        valor: 0,
                    },
                ],
                dataCriacao,
            });

            // Sucesso ao registrar
            setSnackbarMessage("Participante registrado com sucesso!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);

            // Limpar os campos do formulário após salvar
            setNome("");
            setContato("");
            setDataNascimento(getCurrentDate());
            setNomeResponsavel("");
            setContatoResponsavel("");
            setTurma(""); // Limpa a seleção da turma
        } catch (error) {
            console.error("Erro ao salvar participante:", error);
            setSnackbarMessage("Erro ao registrar participante.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    // Função para formatar a data atual para o formato yyyy-mm-dd
    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    // Define a data corrente ao carregar o componente
    useEffect(() => {
        setDataNascimento(getCurrentDate());
    }, []);

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
                    "&:hover": {
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
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 700,
                    marginBottom: 4,
                    marginTop: 6,
                    fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)",
                }}
            >
                Registrar Participante
            </Typography>

            {/* Formulário para registrar participante */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: 3,
                        padding: 4,
                        width: "100%",
                        maxWidth: 500,
                        boxSizing: "border-box",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <TextField
                        label="Nome do Participante"
                        variant="outlined"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        type="number"
                        label="Contato"
                        variant="outlined"
                        value={contato}
                        onChange={(e) => setContato(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Data de Nascimento"
                        variant="outlined"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Nome do Responsável"
                        variant="outlined"
                        value={nomeResponsavel}
                        onChange={(e) => setNomeResponsavel(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        type="number"
                        label="Contato do Responsável"
                        variant="outlined"
                        value={contatoResponsavel}
                        onChange={(e) => setContatoResponsavel(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    {/* Seleção de Turma */}
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Turma</InputLabel>
                        <Select
                            value={turma}
                            onChange={(e) => setTurma(e.target.value)}
                            label="Turma"
                        >
                            <MenuItem value="Terça-feira">Terça-feira</MenuItem>
                            <MenuItem value="Quinta-feira">Quinta-feira</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Botão de Salvar */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ width: "100%", padding: 2 }}
                    >
                        Salvar Participante
                    </Button>
                </Box>
            </Box>

            {/* Snackbar para exibir mensagens de sucesso ou erro */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
        </Box>
    );
};

export default RegistrarParticipante;