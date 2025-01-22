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
    Tooltip,
    Snackbar,
    Paper,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Search, ArrowBack, Edit, Visibility, CheckCircle, RemoveCircle, Sort } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, get, update } from "firebase/database";
import "@fontsource/roboto";
import backgroundImage from "../assets/background.png";

const ListarParticipante = () => {
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortedAsc, setIsSortedAsc] = useState(true); // Controle da ordenação alfabética
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const fetchParticipantes = async () => {
        try {
            const snapshot = await get(ref(database, "participantes"));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const currentMonthYear = new Date().toISOString().slice(0, 7);

                const participantesComStatus = Object.entries(data).map(([matricula, participante]) => {
                    const contribuições = participante.contribuicoesMensais || {};
                    const pagamentoFeito = !!contribuições[currentMonthYear];
                    return {
                        matricula,
                        ...participante,
                        pagamentoFeito,
                    };
                });

                setParticipantes(participantesComStatus);
            }
        } catch (error) {
            console.error("Erro ao carregar participantes:", error);
        }
    };

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

    const handleRegistrarPagamento = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais`);
        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

            const snapshot = await get(participanteRef);
            let updatedData = snapshot.exists()
                ? { ...snapshot.val(), [currentMonthYear]: { mes: currentMonth, ano: currentYear, valor: 1 } }
                : { [currentMonthYear]: { mes: currentMonth, ano: currentYear, valor: 1 } };

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSort = () => {
        setIsSortedAsc((prev) => !prev);
        setParticipantes((prev) =>
            [...prev].sort((a, b) => {
                if (isSortedAsc) return a.nome.localeCompare(b.nome);
                return b.nome.localeCompare(a.nome);
            })
        );
    };

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
            <Button
                onClick={() => navigate("/home-administrativo")}
                sx={{
                    position: "fixed",
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



            <TableContainer
                component={Paper}
                sx={{
                    overflowX: "auto",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    borderRadius: 3,
                    maxWidth: "100%",
                    margin: "auto",
                    height: "620px", // Altura fixa do contêiner
                }}
            >
                {/* Campo de busca fixo */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky", // Mantém fixo no topo do contêiner
                        top: 0, // Gruda no topo
                        zIndex: 2, // Garante que fique acima da tabela
                        backgroundColor: "rgba(255, 255, 255, 1)", // Fundo visível
                        padding: "16px",
                        borderBottom: "1px solid #ccc", // Opcional: linha para separar o cabeçalho
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar por nome ou matrícula..."
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <IconButton onClick={handleSort} sx={{ ml: 2 }}>
                        <Sort />
                    </IconButton>
                </Box>

                {/* Tabela que será rolada */}
                <Table>
                    <TableHead>
                        <TableRow >
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Contato</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participantes
                            .filter(
                                (p) =>
                                    String(p.nome).toLowerCase().includes(searchTerm) ||
                                    String(p.matricula).toLowerCase().includes(searchTerm)
                            )
                            .map((participante) => {
                                const currentMonthYear = new Date().toISOString().slice(0, 7);
                                const pagamentoMesAtual = !!participante.contribuicoesMensais?.[currentMonthYear];

                                return (
                                    <TableRow key={participante.matricula}>
                                        <TableCell>{participante.matricula}</TableCell>
                                        <TableCell>{participante.nome}</TableCell>
                                        <TableCell>{participante.contato}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    navigate(`/editar-participante/${participante.matricula}`)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleMarcarInativo(participante.matricula)}
                                            >
                                                <RemoveCircle />
                                            </IconButton>
                                            <Tooltip
                                                title={
                                                    pagamentoMesAtual
                                                        ? "Contribuição mensal já realizada."
                                                        : "Registrar contribuição mensal"
                                                }
                                                arrow
                                            >
                                                <span>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleRegistrarPagamento(participante.matricula)
                                                        }
                                                        disabled={pagamentoMesAtual}
                                                        sx={{
                                                            color: pagamentoMesAtual ? "green" : "gray",
                                                            "&.Mui-disabled": { color: "green" },
                                                        }}
                                                    >
                                                        <CheckCircle />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <IconButton
                                                color="info"
                                                onClick={() =>
                                                    navigate(`/detalhes-participante/${participante.matricula}`)
                                                }
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
