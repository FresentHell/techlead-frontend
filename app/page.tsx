// Importaciones necesarias
"use client";

import React, { useEffect, useState } from "react";
import "../styles/page.css";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import api from "../services/api";
import EditUserModal from "../components/EditUserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ViewUserModal from "../components/ViewUserModal";
import AddUserModal from "../components/AddUserModal";

interface User {
  id: number;
  name: string;
  email: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.sort((a: User, b: User) => a.id - b.id)); // Orden inicial ascendente
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        showSnackbar("Error al cargar los usuarios", "error");
      }
    };

    fetchUsers().catch((error) => console.error(error));
  }, []);

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers.sort((a, b) => a.id - b.id)); // Orden ascendente en cada actualización
  };

  const handleUserAdded = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.sort((a: User, b: User) => a.id - b.id));
    } catch (error) {
      console.error("Error al actualizar la lista de usuarios:", error);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await api.delete(`/users/${selectedUser.id}`);
        updateUsers(users.filter((user) => user.id !== selectedUser.id));
        showSnackbar("Usuario eliminado con éxito", "success");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        showSnackbar("Error al eliminar usuario", "error");
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    updateUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setIsEditModalOpen(false);
    showSnackbar("Usuario actualizado con éxito", "success");
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset page to the first one to avoid blank pages
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "task-chip pending";
      case "En Progreso":
        return "task-chip in-progress";
      case "Completada":
        return "task-chip completed";
      default:
        return "task-chip";
    }
  };

  const filteredUsers =
    filterStatus === "Todos"
      ? users
      : users.filter((user) => user.tasks.some((task) => task.status === filterStatus));

  const filteredTasks = (tasks: Task[]) =>
    filterStatus === "Todos" ? tasks : tasks.filter((task) => task.status === filterStatus);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">
        Gestión de Usuarios y Tareas
      </Typography>

      <Box className="filter-container">
        <Button
          className="add-user-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + NUEVO USUARIO
        </Button>
        <Box className="status-filter-container">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="En Progreso">En Progreso</MenuItem>
            <MenuItem value="Completada">Completada</MenuItem>
          </Select>
          <Typography className="filter-helper-text">
            * Usar para filtrar por estado
          </Typography>
        </Box>
        <Select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="pagination-select"
        >
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Acciones</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <React.Fragment key={`user-${user.id}`}>
                <TableRow className="user-row">
                  <TableCell rowSpan={filteredTasks(user.tasks).length + 1}>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEditClick(user)}
                        className="edit-button"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Visualizar">
                      <IconButton
                        onClick={() => handleViewClick(user)}
                        className="view-button"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteClick(user)}
                        className="delete-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell rowSpan={filteredTasks(user.tasks).length + 1}>{user.id}</TableCell>
                  <TableCell rowSpan={filteredTasks(user.tasks).length + 1}>{user.name}</TableCell>
                  <TableCell rowSpan={filteredTasks(user.tasks).length + 1}>{user.email}</TableCell>
                </TableRow>
                {filteredTasks(user.tasks).map((task) => (
                  <TableRow key={`task-${task.id}`} className="task-row">
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Chip className={getStatusClass(task.status)} label={task.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="pagination-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          className="pagination-modern"
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modales */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <ConfirmDeleteModal
          userName={selectedUser.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isViewModalOpen && selectedUser && (
        <ViewUserModal
          isOpen={isViewModalOpen}
          user={selectedUser}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </Box>
  );
};

export default HomePage;
