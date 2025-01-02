import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/ViewUserModal.css";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  tasks: Task[];
}

interface ViewUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, isOpen, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "#FFA726";
      case "En Progreso":
        return "#42A5F5";
      case "Completada":
        return "#66BB6A";
      default:
        return "#BDBDBD";
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="user-info-modal">
      <Box className="modal-container">
        <Box className="modal-header">
          <Typography variant="h6" component="h2" className="modal-title">
            Información del Usuario
          </Typography>
          <IconButton onClick={onClose} className="close-icon">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" className="modal-text">
          <strong>Nombre:</strong> {user.name}
        </Typography>
        <Typography variant="subtitle1" className="modal-text">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="subtitle1" className="modal-subtitle">
          Tareas Asignadas:
        </Typography>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-header-cell">Título</TableCell>
                <TableCell className="table-header-cell">Descripción</TableCell>
                <TableCell className="table-header-cell">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.tasks.map((task) => (
                <TableRow key={task.id} className="table-row">
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      sx={{
                        backgroundColor: getStatusColor(task.status),
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default ViewUserModal;
