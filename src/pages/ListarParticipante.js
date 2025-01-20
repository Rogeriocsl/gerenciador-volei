import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Snackbar,
    Paper,
} from "@mui/material";
import backgroundImage from "../assets/background.png";
import { ArrowBack, Edit, Visibility, CheckCircle, RemoveCircle } from "@mui/icons-material"; // Ícones de ações
import { database } from "../firebase"; // Acesso ao banco Firebase (Realtime Database)
import { ref, get, update } from "firebase/database"; // Operações no Realtime Database
import "@fontsource/roboto"; // Fonte Roboto

const ListarParticipante = () => {
    const navigate = useNavigate();

    // Estado para armazenar a lista de participantes
    const [participantes, setParticipantes] = useState([]);
    const [mensagem, setMensagem] = useState("");
    // Estado para o Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleVerDetalhes = (matricula) => {
        navigate(`/detalhes-participante/${matricula}`);
    };

    // Fecha o Snackbar
    const handleCloseSnackbar = () => setOpenSnackbar(false);

    // Função para buscar os participantes do banco de dados
    const fetchParticipantes = async () => {
        try {
            const snapshot = await get(ref(database, "participantes"));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const currentMonthYear = new Date().toISOString().slice(0, 7); // Ex: "2025-01"

                const participantesComStatus = Object.entries(data).map(([matricula, participante]) => {
                    // Verifica se há Contribuição para o mês corrente
                    const contribuições = participante.contribuicoesMensais || {};
                    const pagamentoFeito = !!contribuições[currentMonthYear];

                    return {
                        matricula,
                        ...participante,
                        pagamentoFeito, // Adiciona o status de Contribuição
                    };
                });

                setParticipantes(participantesComStatus);
            }
        } catch (error) {
            console.error("Erro ao carregar participantes:", error);
        }
    };

    // Função para marcar um participante como inativo
    const handleMarcarInativo = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}`);
        try {
            await update(participanteRef, { inativo: true });
            setSnackbarMessage("Participante marcado como inativo.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            fetchParticipantes();
        } catch (error) {
            console.error("Erro ao marcar como inativo:", error);
            setSnackbarMessage("Erro ao marcar participante como inativo.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    // Função para registrar Contribuição do mês corrente
    const handleRegistrarPagamento = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais`);
        try {
            const currentMonth = new Date().getMonth() + 1; // Mês atual (1-12)
            const currentYear = new Date().getFullYear(); // Ano atual
            const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(2, '0')}`; // Ex: "2025-01"

            // Obtém os dados atuais de contribuições
            const snapshot = await get(participanteRef);
            let updatedData = {};

            if (snapshot.exists()) {
                const data = snapshot.val();

                // Atualiza ou adiciona a contribuição do mês corrente
                updatedData = {
                    ...data,
                    [currentMonthYear]: { // Chave com ano e mês
                        mes: currentMonth,
                        ano: currentYear,
                        valor: 1, // Indica Contribuição realizada
                    },
                };
            } else {
                // Se não houver contribuições, adiciona o mês corrente
                updatedData = {
                    [currentMonthYear]: {
                        mes: currentMonth,
                        ano: currentYear,
                        valor: 1,
                    },
                };
            }

            // Atualiza o banco de dados com as contribuições corrigidas
            await update(participanteRef, updatedData);

            setSnackbarMessage("Contribuição registrada com sucesso.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            fetchParticipantes();
        } catch (error) {
            console.error("Erro ao registrar Contribuição:", error);
            setSnackbarMessage("Erro ao registrar Contribuição.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    // UseEffect para buscar os participantes ao carregar o componente
    useEffect(() => {
        fetchParticipantes();
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
                Listar Participantes
            </Typography>

            {/* Tabela de participantes */}
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 3,
                    padding: 2,
                    maxWidth: "90%",
                    margin: "auto",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Contato</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participantes.map((participante) => {
                            const currentMonthYear = new Date().toISOString().slice(0, 7); // Exemplo: "2025-01"
                            const pagamentoMesAtual = !!participante.contribuicoesMensais?.[currentMonthYear];

                            return (
                                <TableRow key={participante.matricula}>
                                    <TableCell>{participante.matricula}</TableCell>
                                    <TableCell>{participante.nome}</TableCell>
                                    <TableCell>{participante.contato}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/editar-participante/${participante.matricula}`)}
                                        >
                                            <Edit />
                                        </IconButton>

                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleMarcarInativo(participante.matricula)}
                                        >
                                            <RemoveCircle />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleRegistrarPagamento(participante.matricula)}
                                            sx={{
                                                color: pagamentoMesAtual ? "green" : "gray", // Atualize aqui
                                            }}
                                        >
                                            <CheckCircle />
                                        </IconButton>

                                        <IconButton
                                            color="info"
                                            onClick={() => handleVerDetalhes(participante.matricula)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para exibir mensagens */}
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

export default ListarParticipante;
