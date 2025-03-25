import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";

const DetalhesParticipanteModal = ({ open, onClose, participante }) => {
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" para mais recente primeiro, "asc" para mais antigo primeiro

  if (!participante) return null;

  const { nome, matricula, dataNascimento, contato, nomeResponsavel, contribuicoesMensais, inativo, presencas } =
    participante;

  // Transformar objeto de contribuições em um array
  const contribuicoesArray = contribuicoesMensais
    ? Object.entries(contribuicoesMensais).map(([key, value]) => ({
      mesAno: key,
      ...value,
    }))
    : [];

  // Ordenar contribuições com base no sortOrder
  const contribuicoesOrdenadas = contribuicoesArray.sort((a, b) => {
    const dateA = new Date(a.dataRegistro ? `${a.dataRegistro.ano}-${a.dataRegistro.mes}-${a.dataRegistro.dia}` : a.mesAno);
    const dateB = new Date(b.dataRegistro ? `${b.dataRegistro.ano}-${b.dataRegistro.mes}-${b.dataRegistro.dia}` : b.mesAno);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Função para exportar contribuições para CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Data,Valor\n" +
      contribuicoesOrdenadas
        .map((c) => {
          const data = c.dataRegistro
            ? `${c.dataRegistro.dia}/${String(c.dataRegistro.mes).padStart(2, "0")}/${c.dataRegistro.ano}`
            : c.mesAno;
          return `${data},${c.valor}`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historico_contribuicoes_${nome}.csv`);
    document.body.appendChild(link); // Requerido para Firefox
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "90vh", // Definir altura máxima
          overflowY: "auto", // Ativar scrollbar se necessário
          maxWidth: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography id="modal-title" variant="h5" fontWeight="bold">
            Detalhes do Participante
          </Typography>
          <IconButton onClick={onClose} color="error">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Nome:</strong> {nome}
          </Typography>
          <Typography variant="body1">
            <strong>Matrícula:</strong> {matricula}
          </Typography>
          <Typography variant="body1">
            <strong>Data de Nascimento:</strong> {dataNascimento}
          </Typography>
          <Typography variant="body1">
            <strong>Contato:</strong> {contato}
          </Typography>
          <Typography variant="body1">
            <strong>Responsável:</strong> {nomeResponsavel || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {inativo ? "Inativo" : "Ativo"}
          </Typography>
        </Box>

        {/* Seção de Histórico de Contribuições */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Histórico de Contribuições
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            variant="outlined"
          >
            <MenuItem value="desc">Mais recente primeiro</MenuItem>
            <MenuItem value="asc">Mais antigo primeiro</MenuItem>
          </Select>
          <Tooltip title="Exportar para CSV">
            <IconButton color="primary" onClick={exportToCSV}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {contribuicoesOrdenadas.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Mês/Ano</strong></TableCell>
                  <TableCell><strong>Data Registro</strong></TableCell>
                  <TableCell><strong>Valor</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contribuicoesOrdenadas.map((contribuicao, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{contribuicao.mesAno}</TableCell>
                    <TableCell>
                      {contribuicao.dataRegistro
                        ? `${String(contribuicao.dataRegistro.dia).padStart(2, "0")}/${String(contribuicao.dataRegistro.mes).padStart(2, "0")}/${contribuicao.dataRegistro.ano}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{contribuicao.valor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhuma contribuição encontrada.
          </Typography>
        )}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button variant="contained" onClick={onClose} color="primary">
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetalhesParticipanteModal;
