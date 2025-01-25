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
    Modal,
} from "@mui/material";
import { Search, ArrowBack, Edit, Visibility, CheckCircle, RemoveCircle, Sort } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import "@fontsource/roboto";
import backgroundImage from "../assets/background.png";

const ListarParticipante = () => {
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortedAsc, setIsSortedAsc] = useState(true); // Controle da ordenação alfabética
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [selectedMesAno, setSelectedMesAno] = useState("");


    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openModal, setOpenModal] = useState(false);
    const [selectedParticipante, setSelectedParticipante] = useState(null);

    const handleOpenModal = (participante) => {
        setSelectedParticipante(participante);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedParticipante(null);
        setOpenModal(false);
    };

    const handleEditParticipante = async () => {
        if (!selectedParticipante) return;
        try {
            const participanteRef = ref(database, `participantes/${selectedParticipante.matricula}`);
            await update(participanteRef, selectedParticipante);
            fetchParticipantes(); // Atualiza a lista
            handleCloseModal(); // Fecha o modal
            handleSnackbarOpen("Participante atualizado com sucesso!"); // Mostra o feedback
            console.log("Participante atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar participante:", error);
            handleSnackbarOpen("Erro ao atualizar participante. Tente novamente.");
        }
    };
  
    const handleRemoverPagamento = async (matricula, mesAno) => {
        if (!matricula || !mesAno) {
            console.log("Matrícula ou Mês/Ano inválido.");
            setSnackbarMessage("Matrícula ou Mês/Ano inválido.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
    
        try {
            const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais/${mesAno}`);
            await remove(participanteRef);
    
            // Exibir feedback de sucesso
            handleSnackbarOpen("Contribuiçao removida com sucesso!"); // Mostra o feedback
            setSnackbarSeverity("success");
            setOpenSnackbar(true); 
            console.log(openSnackbar, "?") // Confirme se isso é chamado
           // handleCloseModal(); // Fecha o modal
    
            // Atualiza a lista de participantes após a remoção
            await fetchParticipantes();
        } catch (error) {
            console.error("Erro ao remover contribuição:", error);
            setSnackbarMessage("Erro ao remover contribuição. Tente novamente.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);  // Confirme se isso é chamado
        }
    };

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
            const snapshot = await get(participanteRef);
            if (!snapshot.exists()) {
                setSnackbarMessage("Participante não encontrado.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            const participante = snapshot.val();
            if (participante.inativo) {
                setSnackbarMessage("Este participante já está marcado como inativo.");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);
                return;
            }

            await update(participanteRef, { inativo: true });
            setSnackbarMessage("Participante marcado como inativo.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            await fetchParticipantes();  // Chama fetch novamente após atualizar
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

    const handleSnackbarOpen = (message, severity = "success") => {
        setSnackbarMessage(message); // Define a mensagem
        setSnackbarSeverity(severity); // Define o tipo (success, error, warning, info)
        setSnackbarOpen(true); // Abre o Snackbar
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Ignora se o usuário clicar fora
        }
        setSnackbarOpen(false); // Fecha o Snackbar
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
                padding: { xs: 1, sm: 2 }, // Menor padding em telas pequenas
            }}

        >
            <Button
                onClick={() => navigate("/home-administrativo")}
                sx={{
                    position: "fixed",
                    top: { xs: 8, sm: 16 }, // Ajusta a distância do topo em telas pequenas
                    left: { xs: 8, sm: 16 }, // Ajusta a distância da lateral
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
                    overflowX: "auto", // Habilita rolagem horizontal em telas pequenas
                    backgroundColor: "rgba(245, 247, 250, 1)",
                    borderRadius: 3,
                    maxWidth: "100%",
                    margin: "auto",
                    height: { xs: "auto", sm: "620px" }, // Ajusta altura conforme o tamanho da tela
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        padding: { xs: "8px 8px", sm: "16px" },
                        borderBottom: "1px solid #e0e0e0",
                        gap: { xs: 1, sm: 2 },
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
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                            },
                        }}
                    />
                    <IconButton onClick={handleSort} sx={{ ml: { xs: 0, sm: 2 } }}>
                        <Sort />
                    </IconButton>
                </Box>

                <Table sx={{ width: "100%" }}> {/* Ajuste da largura para 100% */}
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                    wordBreak: "break-word"
                                }}
                            >
                                Matrícula
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                    wordBreak: "break-word"
                                }}
                            >
                                Nome
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                    wordBreak: "break-word",
                                    display: { xs: "none", sm: "table-cell" }
                                }}
                            >
                                Contato
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                    wordBreak: "break-word"
                                }}
                            >
                                Ações
                            </TableCell>
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
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.7rem", sm: "1rem" },
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {participante.matricula}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.7rem", sm: "1rem" },
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {participante.nome}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: { xs: "0.7rem", sm: "1rem" },
                                                wordBreak: "break-word",
                                                display: { xs: "none", sm: "table-cell" }, // Esconde a coluna "Contato" em telas pequenas
                                            }}
                                        >
                                            {participante.contato}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2, 1fr)",
                                                gap: 1,
                                                [theme => theme.breakpoints.down('sm')]: {
                                                    gridTemplateColumns: "1fr 1fr",
                                                },
                                            }}
                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenModal(participante)}
                                            >
                                                <Edit sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleMarcarInativo(participante.matricula)}
                                            >
                                                <RemoveCircle sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
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
                                                        onClick={() => handleRegistrarPagamento(participante.matricula)}
                                                        disabled={pagamentoMesAtual}
                                                        sx={{
                                                            color: pagamentoMesAtual ? "green" : "gray",
                                                            "&.Mui-disabled": { color: "green" },
                                                        }}
                                                    >
                                                        <CheckCircle sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <IconButton
                                                color="info"
                                                onClick={() => navigate(`/detalhes-participante/${participante.matricula}`)}
                                            >
                                                <Visibility sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>



            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", textAlign: "center", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, boxShadow: 24 }}>
                    <Typography variant="h6" mb={2}>Editar Participante</Typography>
                    {selectedParticipante && (
                        <>
                            <TextField
                                fullWidth
                                label="Nome"
                                value={selectedParticipante.nome || ""}
                                onChange={(e) =>
                                    setSelectedParticipante((prev) => ({ ...prev, nome: e.target.value }))
                                }
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Contato"
                                value={selectedParticipante.contato || ""}
                                onChange={(e) =>
                                    setSelectedParticipante((prev) => ({ ...prev, contato: e.target.value }))
                                }
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Nome Responsavel"
                                value={selectedParticipante.nomeResponsavel || ""}
                                onChange={(e) =>
                                    setSelectedParticipante((prev) => ({ ...prev, nomeResponsavel: e.target.value }))
                                }
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Contato Responsavel"
                                value={selectedParticipante.contatoResponsavel || ""}
                                onChange={(e) =>
                                    setSelectedParticipante((prev) => ({ ...prev, contatoResponsavel: e.target.value }))
                                }
                                margin="normal"
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, direction: "row" }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        const currentMonth = new Date().getMonth() + 1; // mês começa de 0, então somamos 1
                                        const currentYear = new Date().getFullYear();
                                        const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

                                        // Agora chama a função de remoção passando o currentMonthYear
                                        handleRemoverPagamento(selectedParticipante.matricula, currentMonthYear);
                                    }}
                                >
                                    Remover Contribuição Mensal
                                </Button>



                                <Button variant="contained" color="primary" onClick={handleEditParticipante}>
                                    Salvar
                                </Button>
                            </Box>

                        </>
                    )}
                </Box>
            </Modal >


            <Snackbar
    open={snackbarOpen}
    autoHideDuration={6000} // Fecha automaticamente após 6 segundos
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Posição do Snackbar
    message={snackbarMessage}
    ContentProps={{
        style: { backgroundColor: snackbarSeverity === "success" ? "green" : "red" }, // Cores de acordo com o tipo
    }}
/>





        </Box >
    );
};

export default ListarParticipante;
