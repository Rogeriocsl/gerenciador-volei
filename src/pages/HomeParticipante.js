import React, { useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom"; // Importando para pegar o estado da navegação

const HomeParticipante = () => {
  const location = useLocation(); // Usando useLocation para acessar o estado da navegação
  const matricula = location.state?.matricula; // Obtendo a matrícula do estado passado

  const [participante, setParticipante] = useState(null);
  const [historicoContribuicoes, setHistoricoContribuicoes] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch informações do participante
  const fetchParticipante = async () => {
    try {
      if (!matricula) {
        setSnackbarMessage("Matrícula não fornecida.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      const snapshot = await get(ref(database, `participantes/${matricula}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setParticipante(data);
        setHistoricoContribuicoes(data.contribuicoesMensais || []);
      } else {
        setSnackbarMessage("Participante não encontrado.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erro ao buscar participante:", error);
      setSnackbarMessage("Erro ao carregar as informações.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Marcar presença no treino
  const handleMarcarPresenca = async () => {
    const dataAtual = new Date();
    const diaAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dataAtual.getDate()).padStart(2, "0")}`;
    try {
      const presencas = participante.presencas || [];
      if (presencas.includes(diaAtual)) {
        setSnackbarMessage("Presença já marcada para hoje.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
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

      setSnackbarMessage("Presença marcada com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao marcar presença:", error);
      setSnackbarMessage("Erro ao marcar presença.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchParticipante();
  }, [matricula]);

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
