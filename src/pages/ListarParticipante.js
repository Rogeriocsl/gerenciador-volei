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
    MenuItem,
    TableFooter,
} from "@mui/material";
import { Search, ArrowBack, Edit, Visibility, CheckCircle, RemoveCircle, Sort, Download, Assessment } from "@mui/icons-material";
import { database } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import "@fontsource/roboto";
import backgroundImage from "../assets/background.png";
import DetalhesParticipanteModal from "./DetalhesParticipanteModal";

const ListarParticipante = () => {
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortedAsc, setIsSortedAsc] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDetalhesModal, setOpenDetalhesModal] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openModal, setOpenModal] = useState(false);
    const [selectedParticipante, setSelectedParticipante] = useState(null);
    const [filtroTurma, setFiltroTurma] = useState("todas");
    const [mesAnoContribuicao, setMesAnoContribuicao] = useState("");
    const [openContribuicoesModal, setOpenContribuicoesModal] = useState(false);
    const [anoFiltro, setAnoFiltro] = useState("");
    const [mesFiltro, setMesFiltro] = useState("");
    const [contribuicoesFiltradas, setContribuicoesFiltradas] = useState([]);
    const [totalContribuicoes, setTotalContribuicoes] = useState(0);


    const handleAbrirModalContribuicoes = () => {
        setOpenContribuicoesModal(true);
    };

    const handleFecharModalContribuicoes = () => {
        setOpenContribuicoesModal(false);
    };

    const handleFiltrarContribuicoes = () => {
        const filtroMes = mesFiltro ? mesFiltro : new Date().getMonth() + 1;
        const filtroAno = anoFiltro ? anoFiltro : new Date().getFullYear();
        const mesAnoFiltro = `${filtroAno}-${String(filtroMes).padStart(2, "0")}`;

        const contribuicoes = participantes.map((participante) => {
            // Verifica se 'contribuicoesMensais' existe e se o mês/ano está presente
            const contribMesAno = participante.contribuicoesMensais ? participante.contribuicoesMensais[mesAnoFiltro] : null;
            return contribMesAno ? { ...participante, contribuicao: contribMesAno } : null;
        }).filter(Boolean); // Remove os itens null

        setContribuicoesFiltradas(contribuicoes);

        // Calcular o total de contribuições
        const totalContribuicoes = contribuicoes.reduce((total, participante) => {
            return total + (participante.contribuicao ? participante.contribuicao.valor : 0);
        }, 0);

        // Armazenar o total
        setTotalContribuicoes(totalContribuicoes);
    };

    // Função para calcular o total das contribuições
    const calcularTotalContribuicoes = () => {
        let total = 0;
        const currentMonthYear = new Date().toISOString().slice(0, 7); // Obtém o mês atual no formato "YYYY-MM"

        participantes.forEach((participante) => {
            if (participante.contribuicoesMensais) {
                // Filtra as contribuições pelo mês atual
                const contribuicaoMesAtual = participante.contribuicoesMensais[currentMonthYear];
                if (contribuicaoMesAtual) {
                    total += contribuicaoMesAtual.valor || 0;
                }
            }
        });

        return total;
    };

    // Formata o valor para exibir como moeda
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    const handleOpenModal = (participante) => {
        console.log("Participante selecionado:", participante); // Verifique se `turma` está presente
        setSelectedParticipante({
            ...participante,
            turma: participante.turma || "", // Garante que `turma` tenha um valor padrão
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedParticipante(null);
        setOpenModal(false);
    };

    const handleVerDetalhes = (participante) => {
        setSelectedParticipante(participante);
        setOpenDetalhesModal(true);
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
            handleSnackbarOpen("Matrícula ou Mês/Ano inválido.", "error");
            return;
        }

        try {
            const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais/${mesAno}`);
            await remove(participanteRef);

            // Atualiza o estado local do participante
            setSelectedParticipante((prev) => {
                const novasContribuicoes = { ...prev.contribuicoesMensais };
                delete novasContribuicoes[mesAno];
                return { ...prev, contribuicoesMensais: novasContribuicoes };
            });

            // Feedback de sucesso
            handleCloseModal();
            handleSnackbarOpen("Contribuição removida com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao remover contribuição:", error);
            handleSnackbarOpen("Erro ao remover contribuição. Tente novamente.", "error");
        }
    };

    const handleExportToCSV = () => {
        const header = "Nome,Matrícula\n";
        const rows = participantes
            .map(({ nome, matricula }) => `${nome},${matricula}`)
            .join("\n");
        const csvContent = header + rows;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "participantes.csv";
        link.click();
    };

    const fetchParticipantes = async () => {
        try {
            const snapshot = await get(ref(database, "participantes"));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const currentMonthYear = new Date().toISOString().slice(0, 7);

                const participantesComStatus = Object.entries(data)
                    .filter(([_, participante]) => !participante.inativo) // Exclui participantes inativos
                    .map(([matricula, participante]) => {
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
            console.log(participantes)
        } catch (error) {
            console.error("Erro ao carregar participantes:", error);
        }
    };

    const handleMarcarInativo = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}`);
        try {
            const snapshot = await get(participanteRef);
            if (!snapshot.exists()) {
                handleSnackbarOpen("Participante não encontrado.", "error");
                return;
            }

            const participante = snapshot.val();
            if (participante.inativo) {
                handleSnackbarOpen("Este participante já está marcado como inativo.", "info");
                return;
            }

            await update(participanteRef, { inativo: true });
            handleSnackbarOpen("Participante marcado como inativo.", "success");
            await fetchParticipantes(); // Atualiza a lista após marcar como inativo
        } catch (error) {
            console.error("Erro ao marcar como inativo:", error);
            handleSnackbarOpen("Erro ao marcar participante como inativo.", "error");
        }
    };
/*
    const handleRegistrarContribuicaoManual = async () => {
        if (!selectedParticipante || !mesAnoContribuicao) {
            handleSnackbarOpen("Selecione o mês/ano para registrar a contribuição.", "error");
            return;
        }

        try {
            // Extrai o ano e o mês do campo mesAnoContribuicao (formato YYYY-MM)
            const [ano, mes] = mesAnoContribuicao.split("-");

            // Cria o objeto da contribuição com valor fixo de R$ 10,00
            const novaContribuicao = {
                ano: parseInt(ano, 10),
                mes: parseInt(mes, 10),
                valor: 10, // Valor fixo
            };

            // Referência para as contribuições do participante
            const contribuicoesRef = ref(
                database,
                `participantes/${selectedParticipante.matricula}/contribuicoesMensais/${mesAnoContribuicao}`
            );

            // Atualiza o Firebase com a nova contribuição
            await update(contribuicoesRef, novaContribuicao);

            // Atualiza o estado local do participante
            setSelectedParticipante((prev) => ({
                ...prev,
                contribuicoesMensais: {
                    ...prev.contribuicoesMensais,
                    [mesAnoContribuicao]: novaContribuicao,
                },
            }));

            // Limpa o campo do mês/ano após o registro
            setMesAnoContribuicao("");

            // Feedback para o usuário
            handleSnackbarOpen("Contribuição registrada com sucesso!", "success");
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao registrar contribuição manual:", error);
            handleSnackbarOpen("Erro ao registrar contribuição manual.", "error");
        }
    };
    */
    const handleRegistrarContribuicaoManual = async () => {
        if (!selectedParticipante || !mesAnoContribuicao) {
            handleSnackbarOpen("Selecione o mês/ano para registrar a contribuição.", "error");
            return;
        }
    
        try {
            // Extrai o ano e o mês do campo mesAnoContribuicao (formato YYYY-MM)
            const [ano, mes] = mesAnoContribuicao.split("-");
    
            // Obtém a data atual do registro
            const dataAtual = new Date();
            const dia = dataAtual.getDate();
            const mesRegistro = dataAtual.getMonth() + 1; // Meses começam do 0
            const anoRegistro = dataAtual.getFullYear();
    
            // Cria o objeto da contribuição com valor fixo de R$ 10,00
            const novaContribuicao = {
                ano: parseInt(ano, 10),
                mes: parseInt(mes, 10),
                valor: 10, // Valor fixo
                dataRegistro: {
                    dia,
                    mes: mesRegistro,
                    ano: anoRegistro,
                },
            };
    
            // Referência para as contribuições do participante
            const contribuicoesRef = ref(
                database,
                `participantes/${selectedParticipante.matricula}/contribuicoesMensais/${mesAnoContribuicao}`
            );
    
            // Atualiza o Firebase com a nova contribuição
            await update(contribuicoesRef, novaContribuicao);
    
            // Atualiza o estado local do participante
            setSelectedParticipante((prev) => ({
                ...prev,
                contribuicoesMensais: {
                    ...prev.contribuicoesMensais,
                    [mesAnoContribuicao]: novaContribuicao,
                },
            }));
    
            // Limpa o campo do mês/ano após o registro
            setMesAnoContribuicao("");
    
            // Feedback para o usuário
            handleSnackbarOpen("Contribuição registrada com sucesso!", "success");
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao registrar contribuição manual:", error);
            handleSnackbarOpen("Erro ao registrar contribuição manual.", "error");
        }
    };
    

/*
    const handleRegistrarPagamento = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais`);
        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

            const snapshot = await get(participanteRef);
            let updatedData = snapshot.exists()
                ? { ...snapshot.val(), [currentMonthYear]: { mes: currentMonth, ano: currentYear, valor: 10 } }
                : { [currentMonthYear]: { mes: currentMonth, ano: currentYear, valor: 10 } };

            await update(participanteRef, updatedData);

            // Atualiza o estado `pagamentoFeito` para o participante específico
            setParticipantes((prev) =>
                prev.map((participante) =>
                    participante.matricula === matricula
                        ? { ...participante, pagamentoFeito: true }
                        : participante
                )
            );

            // Feedback para o usuário
            setSnackbarMessage("Contribuição registrada com sucesso.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Erro ao registrar Contribuição:", error);
            setSnackbarMessage("Erro ao registrar Contribuição.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };*/

    const handleRegistrarPagamento = async (matricula) => {
        const participanteRef = ref(database, `participantes/${matricula}/contribuicoesMensais`);
        try {
            const dataAtual = new Date();
            const currentMonth = dataAtual.getMonth() + 1;
            const currentYear = dataAtual.getFullYear();
            const currentDay = dataAtual.getDate();
            const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    
            const snapshot = await get(participanteRef);
            let updatedData = snapshot.exists()
                ? {
                      ...snapshot.val(),
                      [currentMonthYear]: {
                          mes: currentMonth,
                          ano: currentYear,
                          valor: 10,
                          dataRegistro: {
                              dia: currentDay,
                              mes: currentMonth,
                              ano: currentYear,
                          },
                      },
                  }
                : {
                      [currentMonthYear]: {
                          mes: currentMonth,
                          ano: currentYear,
                          valor: 10,
                          dataRegistro: {
                              dia: currentDay,
                              mes: currentMonth,
                              ano: currentYear,
                          },
                      },
                  };
    
            await update(participanteRef, updatedData);
    
            // Atualiza o estado `pagamentoFeito` para o participante específico
            setParticipantes((prev) =>
                prev.map((participante) =>
                    participante.matricula === matricula
                        ? { ...participante, pagamentoFeito: true }
                        : participante
                )
            );
    
            // Feedback para o usuário
            setSnackbarMessage("Contribuição registrada com sucesso.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
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
                        flexDirection: { xs: "row", sm: "row" }, // Sempre em linha
                        flexWrap: "wrap", // Permite que os elementos quebrem para a próxima linha se necessário
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        padding: { xs: "8px", sm: "16px" }, // Ajuste do padding para telas pequenas
                        borderBottom: "1px solid #e0e0e0",
                        gap: { xs: 1, sm: 1 }, // Reduz o espaçamento entre os elementos em telas grandes
                    }}
                >
                    {/* Campo de Pesquisa */}
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
                            flex: { xs: "1 1 100%", sm: "2 1 auto" }, // Ocupa mais espaço em telas grandes
                            mb: { xs: 1, sm: 0 }, // Margem inferior em telas pequenas
                        }}
                    />

                    {/* Botões de Ordenação e Exportação */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1, // Espaçamento entre os ícones
                            flex: { xs: "0 1 auto", sm: "0 0 auto" }, // Não cresce em telas grandes
                        }}
                    >
                        <IconButton onClick={handleSort}>
                            <Sort />
                        </IconButton>

                        <IconButton onClick={handleAbrirModalContribuicoes}>
                            <Assessment />
                        </IconButton>

                        <IconButton onClick={handleExportToCSV}>
                            <Download />
                        </IconButton>

                    </Box>

                    {/* Filtro de Turma */}
                    <TextField
                        select
                        label="Filtrar por Turma"
                        value={filtroTurma}
                        onChange={(e) => setFiltroTurma(e.target.value)}
                        sx={{
                            minWidth: 120,
                            flex: { xs: "1 1 50%", sm: "1 1 auto" }, // Ocupa espaço proporcional em telas grandes
                            mb: { xs: 1, sm: 0 }, // Margem inferior em telas pequenas
                        }}
                    >
                        <MenuItem value="todas">Todas</MenuItem>
                        <MenuItem value="Terça-Feira">Terça-Feira</MenuItem>
                        <MenuItem value="Quinta-Feira">Quinta-feira</MenuItem>
                    </TextField>
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
                            .filter((p) => {
                                const matchesSearch = String(p.nome).toLowerCase().includes(searchTerm) ||
                                    String(p.matricula).toLowerCase().includes(searchTerm);
                                const matchesTurma = filtroTurma === "todas" ||
                                    (filtroTurma === "Terça-Feira" && p.turma === "Terça-Feira") ||
                                    (filtroTurma === "Quinta-Feira" && p.turma === "Quinta-Feira");
                                return matchesSearch && matchesTurma;
                            })
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
                                                display: "flex", // Usar flexbox para organizar os ícones
                                                flexDirection: "row", // Ícones em linha
                                                flexWrap: "wrap", // Permite que os ícones quebrem para a próxima linha se necessário
                                                gap: 1, // Espaçamento entre os ícones
                                                justifyContent: "center", // Centraliza os ícones
                                                alignItems: "center", // Alinha os ícones verticalmente
                                                [theme => theme.breakpoints.down('sm')]: {
                                                    gap: 0.5, // Reduz o espaçamento no mobile
                                                },
                                            }}
                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenModal(participante)}
                                                sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} // Ajusta o tamanho dos ícones
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleMarcarInativo(participante.matricula)}
                                                sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
                                            >
                                                <RemoveCircle />
                                            </IconButton>
                                            <Tooltip
                                                title={
                                                    participante.pagamentoFeito
                                                        ? "Contribuição mensal já realizada."
                                                        : "Registrar contribuição mensal"
                                                }
                                                arrow
                                            >
                                                <span>
                                                    <IconButton
                                                        onClick={() => handleRegistrarPagamento(participante.matricula)}
                                                        disabled={participante.pagamentoFeito}
                                                        sx={{
                                                            color: participante.pagamentoFeito ? "green" : "gray",
                                                            "&.Mui-disabled": { color: "green" },
                                                            fontSize: { xs: "1rem", sm: "1.5rem" },
                                                        }}
                                                    >
                                                        <CheckCircle />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <IconButton
                                                color="info"
                                                onClick={() => handleVerDetalhes(participante)}
                                                sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                                Total das Contribuições do Mês: {formatarMoeda(calcularTotalContribuicoes())}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            <Modal open={openContribuicoesModal} onClose={handleFecharModalContribuicoes}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 3,
                        boxShadow: 24,
                        width: "90%",
                        maxWidth: 500,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" textAlign="center">
                        Contribuições Recebidas
                    </Typography>

                    {/* Filtros de Mês e Ano */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            select
                            label="Mês"
                            value={mesFiltro}
                            onChange={(e) => setMesFiltro(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="01">Janeiro</MenuItem>
                            <MenuItem value="02">Fevereiro</MenuItem>
                            <MenuItem value="03">Março</MenuItem>
                            <MenuItem value="04">Abril</MenuItem>
                            <MenuItem value="05">Maio</MenuItem>
                            <MenuItem value="06">Junho</MenuItem>
                            <MenuItem value="07">Julho</MenuItem>
                            <MenuItem value="08">Agosto</MenuItem>
                            <MenuItem value="09">Setembro</MenuItem>
                            <MenuItem value="10">Outubro</MenuItem>
                            <MenuItem value="11">Novembro</MenuItem>
                            <MenuItem value="12">Dezembro</MenuItem>

                        </TextField>

                        <TextField
                            select
                            label="Ano"
                            value={anoFiltro}
                            onChange={(e) => setAnoFiltro(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value={new Date().getFullYear()}>{new Date().getFullYear()}</MenuItem>
                            <MenuItem value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</MenuItem>
                            {/* Adicione outros anos se necessário */}
                        </TextField>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFiltrarContribuicoes}
                        sx={{ width: "100%" }}
                    >
                        Filtrar
                    </Button>

                    {/* Exibir Contribuições Filtradas */}
                    <Box sx={{ marginTop: 2 }}>
                        {contribuicoesFiltradas.length === 0 ? (
                            <Typography variant="body1" color="textSecondary">
                                Nenhuma contribuição encontrada para o mês e ano selecionados.
                            </Typography>
                        ) : (
                            <>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Matrícula</TableCell>
                                            <TableCell>Nome</TableCell>
                                            <TableCell>Valor Contribuição</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {contribuicoesFiltradas.map((participante) => (
                                            <TableRow key={participante.matricula}>
                                                <TableCell>{participante.matricula}</TableCell>
                                                <TableCell>{participante.nome}</TableCell>
                                                <TableCell>{formatarMoeda(participante.contribuicao.valor)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Exibir Total de Contribuições */}
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="h6" align="right">
                                        Total das Contribuições: {formatarMoeda(totalContribuicoes)}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>


                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={handleFecharModalContribuicoes}
                    >
                        Fechar
                    </Button>
                </Box>
            </Modal>


            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 3,
                        boxShadow: 24,
                        width: "90%",
                        maxWidth: 500,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" textAlign="center">Editar Participante</Typography>

                    {selectedParticipante && (
                        <>
                            {/* Campos de edição do participante */}
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    value={selectedParticipante.nome || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, nome: e.target.value }))
                                    }
                                />
                                <TextField
                                    fullWidth
                                    label="Contato"
                                    value={selectedParticipante.contato || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, contato: e.target.value }))
                                    }
                                />
                            </Box>

                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nome Responsável"
                                    value={selectedParticipante.nomeResponsavel || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, nomeResponsavel: e.target.value }))
                                    }
                                />
                                <TextField
                                    fullWidth
                                    label="Contato Responsável"
                                    value={selectedParticipante.contatoResponsavel || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, contatoResponsavel: e.target.value }))
                                    }
                                />
                            </Box>

                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Data de Nascimento"
                                    type="date"
                                    value={selectedParticipante.dataNascimento || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, dataNascimento: e.target.value }))
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    select
                                    label="Turma"
                                    value={selectedParticipante.turma || ""}
                                    onChange={(e) =>
                                        setSelectedParticipante((prev) => ({ ...prev, turma: e.target.value }))
                                    }
                                >
                                    <MenuItem value="Terça-Feira">Terça-Feira</MenuItem>
                                    <MenuItem value="Quinta-Feira">Quinta-Feira</MenuItem>
                                </TextField>
                            </Box>

                            {/* Campo para selecionar o mês/ano da contribuição */}
                            <TextField
                                fullWidth
                                label="Selecione o Mês/Ano da Contribuição"
                                type="month"
                                value={mesAnoContribuicao}
                                onChange={(e) => setMesAnoContribuicao(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />

                            {/* Botões de ação */}
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2, mt: 2 }}>
                                {/* Botão para remover a contribuição selecionada */}
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={() => {
                                        if (!mesAnoContribuicao) {
                                            handleSnackbarOpen("Selecione um mês/ano para remover a contribuição.", "error");
                                            return;
                                        }
                                        handleRemoverPagamento(selectedParticipante.matricula, mesAnoContribuicao);
                                    }}
                                >
                                    Remover Contribuição
                                </Button>

                                {/* Botão para registrar uma nova contribuição */}
                                <Button variant="contained" color="secondary" fullWidth onClick={handleRegistrarContribuicaoManual}>
                                    Registrar Contribuição
                                </Button>

                                {/* Botão para salvar as alterações */}
                                <Button variant="contained" color="primary" fullWidth onClick={handleEditParticipante}>
                                    Salvar
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
            
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

            <DetalhesParticipanteModal
                open={openDetalhesModal}
                onClose={() => setOpenDetalhesModal(false)}
                participante={selectedParticipante}
            />



        </Box >
    );
};

export default ListarParticipante;
