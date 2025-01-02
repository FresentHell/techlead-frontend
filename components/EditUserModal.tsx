import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../services/api";
import "../styles/EditUserModal.css";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  tasks: Task[];
}

interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  userId?: number;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tasks, setTasks] = useState<Task[]>(user.tasks);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: "Pendiente",
    userId: user.id,
  });
  const [errors, setErrors] = useState({ name: "", email: "", title: "", description: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        return value.trim() === "" ? "El nombre es obligatorio" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "El email no es válido" : "";
      case "title":
        return value.length > 50 ? "El título no puede exceder 50 caracteres" : "";
      case "description":
        return value.length > 200 ? "La descripción no puede exceder 200 caracteres" : "";
      default:
        return "";
    }
  };

  const handleAddTask = async () => {
    const titleError = validateField("title", newTask.title);
    const descriptionError = validateField("description", newTask.description);

    if (titleError || descriptionError) {
      setErrors({ ...errors, title: titleError, description: descriptionError });
      showSnackbar("Corrige los errores en la nueva tarea", "error");
      return;
    }

    try {
      const response = await api.post(`/tasks`, newTask);
      const addedTask = response.data;

      setTasks([...tasks, addedTask]);
      setNewTask({
        title: "",
        description: "",
        status: "Pendiente",
        userId: user.id,
      });
      showSnackbar("Tarea agregada con éxito.", "success");
    } catch (error) {
      showSnackbar("Error al agregar la tarea. Por favor, intenta de nuevo.", "error");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      showSnackbar("Tarea eliminada con éxito.", "success");
    } catch (error) {
      showSnackbar("Error al eliminar la tarea. Por favor, intenta de nuevo.", "error");
    }
  };

  const handleSave = async () => {
    const nameError = validateField("name", name);
    const emailError = validateField("email", email);

    if (nameError || emailError) {
      setErrors({ ...errors, name: nameError, email: emailError });
      showSnackbar("Corrige los errores en el formulario", "error");
      return;
    }

    const updatedUser: User = { ...user, name, email, tasks };

    try {
      await api.put(`/users/${user.id}`, updatedUser);
      onSave(updatedUser);
      showSnackbar("Cambios guardados correctamente.", "success");
      onClose();
    } catch (error) {
      showSnackbar("Error al guardar los cambios. Por favor, intenta de nuevo.", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={true} onClose={onClose} aria-labelledby="edit-user-modal">
        <Box className="edit-user-modal">
          <Typography variant="h6" component="h2" className="modal-title">
            Editar Usuario
          </Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: validateField("name", e.target.value) });
            }}
            className="input-field"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: validateField("email", e.target.value) });
            }}
            className="input-field"
            error={!!errors.email}
            helperText={errors.email}
          />
          <Typography variant="subtitle1" className="section-title">
            Tareas
          </Typography>
          <Box className="task-add-container">
            <TextField
              label="Título"
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                setErrors({ ...errors, title: validateField("title", e.target.value) });
              }}
              size="small"
              className="task-input"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Descripción"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
                setErrors({ ...errors, description: validateField("description", e.target.value) });
              }}
              size="small"
              className="task-input"
              error={!!errors.description}
              helperText={errors.description}
            />
            <Select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              size="small"
              className="task-select"
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En Progreso">En Progreso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={handleAddTask}
              className="add-task-button"
              startIcon={<AddIcon />}
            >
              Agregar Tarea
            </Button>
          </Box>
          <TableContainer component={Paper} className="task-table-container">
            <Table>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <TextField
                        value={task.title}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, title: e.target.value } : t
                            )
                          )
                        }
                        size="small"
                        className="task-input"
                      />
                      <TextField
                        value={task.description}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, description: e.target.value } : t
                            )
                          )
                        }
                        size="small"
                        className="task-input"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={task.status}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, status: e.target.value } : t
                            )
                          )
                        }
                        size="small"
                        className="task-select"
                      >
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="En Progreso">En Progreso</MenuItem>
                        <MenuItem value="Completada">Completada</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteTask(task.id!)}
                        className="delete-task-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="modal-actions">
            <Button onClick={onClose} className="cancel-button">
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} className="save-button">
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserModal;
