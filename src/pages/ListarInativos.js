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
    Paper,
    Snackbar,
} from "@mui/material";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, get, update } from "firebase/database";
import backgroundImage from "../assets/background.png";

const ListarInativos = () => {
    const navigate = useNavigate();

    const [participantesInativos, setParticipantesInativos] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Busca os participantes inativos
    const fetchParticipantesInativos = async () => {
        try {
            const snapshot = await get(ref(database, "participantes"));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const inativos = Object.entries(data)
                    .filter(([_, participante]) => participante.inativo) // Filtra apenas os inativos
                    .map(([matricula, participante]) => ({
                        matricula,
                        ...participante,
                    }));
                setParticipantesInativos(inativos);
            }
        } catch (error) {
            console.error("Erro ao carregar participantes inativos:", error);
        }
    };

    // Reativa um participante
    const handleReativarParticipante = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}`);
        try {
            await update(participanteRef, { inativo: false });
            setSnackbarMessage("Participante reativado com sucesso!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            fetchParticipantesInativos(); // Atualiza a lista após reativar
        } catch (error) {
            console.error("Erro ao reativar participante:", error);
            setSnackbarMessage("Erro ao reativar participante.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    // Fecha o Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    useEffect(() => {
        fetchParticipantesInativos();
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
                padding: { xs: 1, sm: 2 },
            }}
        >
            {/* Botão de Voltar */}
            <Button
                onClick={() => navigate("/home-administrativo")}
                sx={{
                    position: "fixed",
                    top: { xs: 8, sm: 16 },
                    left: { xs: 8, sm: 16 },
                    backgroundColor: "#1976d2",
                    "&:hover": {
                        backgroundColor: "#1565c0",
                    },
                }}
            >
                <ArrowBack sx={{ fontSize: 30, color: "white" }} />
            </Button>

            {/* Título da Página */}
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
                Participantes Inativos
            </Typography>

            {/* Tabela de Participantes Inativos */}
            <TableContainer
                component={Paper}
                sx={{
                    overflowX: "auto",
                    backgroundColor: "rgba(245, 247, 250, 1)",
                    borderRadius: 3,
                    maxWidth: "100%",
                    margin: "auto",
                    height: { xs: "auto", sm: "620px" },
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                                Matrícula
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                                Nome
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participantesInativos.map((participante) => (
                            <TableRow
                                key={participante.matricula}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "#f9f9f9",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f1f1f1",
                                    },
                                }}
                            >
                                <TableCell align="center">{participante.matricula}</TableCell>
                                <TableCell align="center">{participante.nome}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleReativarParticipante(participante.matricula)}
                                    >
                                        <CheckCircle />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                message={snackbarMessage}
                ContentProps={{
                    style: { backgroundColor: snackbarSeverity === "success" ? "green" : "red" },
                }}
            />
        </Box>
    );
};

export default ListarInativos;