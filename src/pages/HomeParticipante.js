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
} from "@mui/material";
import { database } from "../firebase";
import { ref, get, update } from "firebase/database";
import { useLocation } from "react-router-dom";

const HomeParticipante = () => {
  const location = useLocation();
  const matricula = location.state?.matricula;

  const [participante, setParticipante] = useState(null);
  const [historicoContribuicoes, setHistoricoContribuicoes] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
        setHistoricoContribuicoes(data.contribuicoesMensais || []);
      } else {
        showSnackbar("Participante não encontrado.", "error");
      }
    } catch (error) {
      console.error("Erro ao buscar participante:", error);
      showSnackbar("Erro ao carregar as informações.", "error");
    }
  }, [matricula]);

  const handleMarcarPresenca = async () => {
    const dataAtual = new Date();
    const diaAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dataAtual.getDate()).padStart(2, "0")}`;

    try {
      const presencas = participante.presencas || [];
      if (presencas.includes(diaAtual)) {
        showSnackbar("Presença já marcada para hoje.", "warning");
        return;
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
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchParticipante();
  }, [fetchParticipante]);

  return (
    <Box p={3}>
      {participante ? (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Bem-vindo, {participante.nome}
              </Typography>
              <Typography variant="subtitle1">
                Matrícula: {matricula}
              </Typography>
              <Typography variant="subtitle1">
                Data de Registro: {participante.dataRegistro || "N/A"}
              </Typography>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Histórico de Contribuições</Typography>
            <Button variant="contained" color="primary" onClick={handleMarcarPresenca}>
              Marcar Presença no Treino
            </Button>
          </Box>

          {historicoContribuicoes && Object.entries(historicoContribuicoes).length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ano-Mês</TableCell>
                    <TableCell>Valor Contribuído</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(historicoContribuicoes).map(([mesAno, contrib]) => (
                    <TableRow key={mesAno}>
                      <TableCell>{mesAno}</TableCell>
                      <TableCell>R$ {contrib.valor.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">Nenhuma contribuição registrada.</Typography>
          )}
        </>
      ) : (
        <Typography variant="body1">Carregando informações...</Typography>
      )}

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