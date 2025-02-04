import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { database } from "../firebase";
import { ref, get, update } from "firebase/database";
import { useLocation } from "react-router-dom";
import backgroundImage from "../assets/background.png";

const HomeParticipante = () => {
  const location = useLocation();
  const matricula = location.state?.matricula;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [participante, setParticipante] = useState(null);
  const [historicoContribuicoes, setHistoricoContribuicoes] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchParticipante = useCallback(async () => {
    try {
      if (!matricula) {
        showSnackbar("Matrícula não fornecida.", "error");
        return;
      }

      const snapshot = await get(ref(database, `participantes/${matricula}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setParticipante(data);
        setHistoricoContribuicoes(data.contribuicoesMensais || {});
      } else {
        showSnackbar("Participante não encontrado.", "error");
      }
    } catch (error) {
      console.error("Erro ao buscar participante:", error);
      showSnackbar("Erro ao carregar as informações.", "error");
    }
  }, [matricula]);

  const handleMarcarPresenca = async () => {
    setDialogOpen(true); // Abre o Dialog ao clicar no botão
  };

  const confirmarPresenca = async () => {
    const dataAtual = new Date();
    const diaAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dataAtual.getDate()).padStart(2, "0")}`;

    try {
      const presencas = participante.presencas || [];

      // Verifica se a presença já foi marcada hoje
      if (presencas.includes(diaAtual)) {
        showSnackbar("Presença já marcada para hoje.", "warning");
        return;
      }

      // Verifica se a presença foi marcada nos últimos 7 dias
      const ultimaPresenca = presencas[presencas.length - 1];
      if (ultimaPresenca) {
        const dataUltimaPresenca = new Date(ultimaPresenca);
        const diferencaDias = (dataAtual - dataUltimaPresenca) / (1000 * 60 * 60 * 24);

        if (diferencaDias < 7) {
          showSnackbar("Presença só pode ser marcada uma vez a cada 7 dias.", "warning");
          return;
        }
      }

      const novasPresencas = [...presencas, diaAtual];
      await update(ref(database, `participantes/${matricula}`), {
        presencas: novasPresencas,
      });

      setParticipante((prev) => ({
        ...prev,
        presencas: novasPresencas,
      }));

      showSnackbar("Presença marcada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao marcar presença:", error);
      showSnackbar("Erro ao marcar presença.", "error");
    } finally {
      setDialogOpen(false); // Fecha o Dialog após a ação
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const gerarMesesDoAno = () => {
    const meses = [];
    const anoAtual = new Date().getFullYear();

    for (let mes = 1; mes <= 12; mes++) {
      const mesFormatado = String(mes).padStart(2, "0"); // Formata o mês com dois dígitos (01, 02, ..., 12)
      meses.push(`${anoAtual}-${mesFormatado}`);
    }

    return meses;
  };

  const verificarContribuicao = (mesAno, historicoContribuicoes) => {
    return historicoContribuicoes[mesAno] ? "Pago" : "Não Pago";
  };

  const getNomeMes = (mesAno) => {
    const [ano, mes] = mesAno.split("-"); // Divide o formato YYYY-MM
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`; // Retorna o nome do mês e o ano
  };

  useEffect(() => {
    fetchParticipante();
  }, [fetchParticipante]);

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
      }}
      p={isMobile ? 2 : 3}
    >
      {participante ? (
        <>
          <Card
            sx={{
              mb: { xs: 2, md: 3 },
              height: { xs: 400, md: 300 },
              borderRadius: 3,
              boxShadow: 4,
              p: { xs: 2, md: 3 },
              background: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                Bem-vindo, {participante.nome}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 2, fontSize: { xs: "1rem", md: "1.2rem" } }}
              >
                Matrícula: {matricula}
              </Typography>

              {/* Exibe mensagem de participante inativo ou ativo */}
              {participante.inativo ? (
                <Alert
                  severity="error"
                  sx={{ mt: 2, width: "100%", maxWidth: 400, mx: "auto" }}
                >
                  Você não é um participante ativo.
                </Alert>
              ) : (
                <Alert
                  severity="success"
                  sx={{ mt: 2, width: "100%", maxWidth: 400, mx: "auto" }}
                >
                  Você é um participante ativo.
                </Alert>
              )}
            </CardContent>
          </Card>


          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            mb={3}
            gap={2}
          >
            <Typography
              variant="h7"
              sx={{
                textAlign: "center",
                color: "white",
                fontFamily: "Roboto, sans-serif",
                fontWeight: 700,
                marginBottom: 4,
                marginTop: 6,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)",
              }}
            >
              Histórico de Contribuições
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMarcarPresenca}
              sx={{ minWidth: isMobile ? "100%" : "auto" }}
              disabled={participante.inativo} // Desabilita o botão se o participante estiver inativo
            >
              Marcar Presença no Treino
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Mês Corrente</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gerarMesesDoAno().map((mesAno) => {
                  const status = verificarContribuicao(mesAno, historicoContribuicoes);
                  return (
                    <TableRow key={mesAno}>
                      <TableCell>{getNomeMes(mesAno)}</TableCell>
                      <TableCell
                        sx={{
                          height: "20px",
                          width: "150px", // Largura fixa
                          backgroundColor: status === "Pago" ? "#4caf50" : "#f44336", // Verde para "Pago", vermelho para "Não Pago"
                          color: "white", // Texto branco para melhor contraste
                          fontWeight: "bold", // Texto em negrito
                          borderRadius: "8px", // Bordas arredondadas
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra sutil
                          transition: "background-color 0.3s ease", // Transição suave
                          textAlign: "center", // Centraliza o texto horizontalmente
                          padding: "8px 16px", // Espaçamento interno
                          "&:hover": {
                            backgroundColor: status === "Pago" ? "#388e3c" : "#d32f2f", // Tons mais escuros ao passar o mouse
                          },
                        }}
                      >
                        {status}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="body1">Carregando informações...</Typography>
      )}

      {/* Dialog de confirmação */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmação de Presença</DialogTitle>
        <DialogContent>
          <Typography>Você participou do treino hoje?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Não
          </Button>
          <Button onClick={confirmarPresenca} color="primary" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        ContentProps={{
          style: { backgroundColor: snackbarSeverity === "success" ? "green" : "red" },
        }}
      />
    </Box>
  );
};

export default HomeParticipante;
