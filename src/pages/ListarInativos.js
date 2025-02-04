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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { ArrowBack, CheckCircle, Delete } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import backgroundImage from "../assets/background.png";

const ListarInativos = () => {
    const navigate = useNavigate();

    const [participantesInativos, setParticipantesInativos] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMatricula, setSelectedMatricula] = useState(null);

    const fetchParticipantesInativos = async () => {
        try {
            const snapshot = await get(ref(database, "participantes"));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const inativos = Object.entries(data)
                    .filter(([_, participante]) => participante.inativo)
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

    const handleReativarParticipante = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}`);
        try {
            await update(participanteRef, { inativo: false });
            setSnackbarMessage("Participante reativado com sucesso!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            fetchParticipantesInativos();
        } catch (error) {
            console.error("Erro ao reativar participante:", error);
            setSnackbarMessage("Erro ao reativar participante.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleDeleteClick = (matricula) => {
        setSelectedMatricula(matricula);
        setDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedMatricula) {
            try {
                await remove(ref(database, `participantes/${selectedMatricula}`));
                setSnackbarMessage("Participante excluído com sucesso!");
                setSnackbarSeverity("success");
                fetchParticipantesInativos();
            } catch (error) {
                setSnackbarMessage("Erro ao excluir participante.");
                setSnackbarSeverity("error");
            }
            setSnackbarOpen(true);
            setDialogOpen(false);
            setSelectedMatricula(null);
        }
    };

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

            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: 700,
                    marginBottom: 4,
                    marginTop: 6,
                    fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)",
                }}
            >
                Participantes Inativos
            </Typography>

            <TableContainer component={Paper} sx={{ overflowX: "auto", borderRadius: 3, maxWidth: "100%", margin: "auto", height: { xs: "auto", sm: "620px" } }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participantesInativos.map((participante) => (
                            <TableRow key={participante.matricula}>
                                <TableCell align="center">{participante.matricula}</TableCell>
                                <TableCell align="center">{participante.nome}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleReativarParticipante(participante.matricula)}>
                                        <CheckCircle />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteClick(participante.matricula)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>Tem certeza que deseja excluir este participante?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
        </Box>
    );
};

export default ListarInativos;
