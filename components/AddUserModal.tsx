import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../services/api";
import "../styles/AddUserModal.css";

interface Task {
  title: string;
  description: string;
  status: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: { id: number; name: string; email: string; tasks: Task[] }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: "Pendiente",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", title: "", description: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (value.trim() === "") return "El nombre es obligatorio.";
        if (value.length > 30) return "El nombre no puede tener más de 30 caracteres.";
        return "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "El email no es válido." : "";
      case "password":
        return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
          ? ""
          : "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.";
      case "title":
        if (value.trim() === "") return "El título de la tarea es obligatorio.";
        if (value.length > 30) return "El título no puede tener más de 30 caracteres.";
        return "";
      case "description":
        if (value.trim() === "") return "La descripción de la tarea es obligatoria.";
        if (value.length > 100) return "La descripción no puede tener más de 100 caracteres.";
        return "";
      default:
        return "";
    }
  };

  const handleAddTask = () => {
    const titleError = validateField("title", newTask.title);
    const descriptionError = validateField("description", newTask.description);

    if (titleError || descriptionError) {
      setErrors({ ...errors, title: titleError, description: descriptionError });
      showSnackbar("Corrige los errores en la nueva tarea.", "error");
      return;
    }

    setTasks([...tasks, newTask]);
    setNewTask({ title: "", description: "", status: "Pendiente" });
    showSnackbar("Tarea agregada con éxito.", "success");
  };

  const handleAddUser = async () => {
    const nameError = validateField("name", name);
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (nameError || emailError || passwordError) {
      setErrors({ ...errors, name: nameError, email: emailError, password: passwordError });
      showSnackbar("Corrige los errores en el formulario.", "error");
      return;
    }

    try {
     
      const newUserPayload = { name, email, password };
    

      const newUserResponse = await api.post(`/users`, newUserPayload);


      for (const task of tasks) {
        const taskPayload = { ...task, userId: newUserResponse.data.id };
       
        await api.post(`/tasks`, taskPayload);
      }

      showSnackbar("Usuario y tareas agregados con éxito.", "success");
      setName("");
      setEmail("");
      setPassword("");
      setTasks([]);
      onUserAdded(newUserResponse.data);
      onClose();
    } catch (error: any) {
      console.error("Error in request:", error.response?.data || error.message);
      showSnackbar("Error al agregar el usuario. Por favor, verifica los datos y vuelve a intentarlo.", "error");
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
      <Modal open={isOpen} onClose={onClose} aria-labelledby="add-user-modal">
        <Box
          className="add-user-modal"
          sx={{ width: "700px", padding: "30px", backgroundColor: "white", borderRadius: "10px" }}
        >
          <Typography
            variant="h5"
            component="h2"
            className="modal-title"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            Agregar Usuario
          </Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: validateField("name", e.target.value) });
            }}
            error={!!errors.name}
            helperText={errors.name}
            className="input-field"
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: validateField("email", e.target.value) });
            }}
            error={!!errors.email}
            helperText={errors.email}
            className="input-field"
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: validateField("password", e.target.value) });
            }}
            error={!!errors.password}
            helperText={errors.password}
            className="input-field"
            sx={{ marginBottom: "20px" }}
          />
          <Typography variant="subtitle1" className="section-title" sx={{ marginBottom: "10px" }}>
            Tareas
          </Typography>
          <Box
            className="task-container"
            sx={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "flex-start" }}
          >
            <TextField
              label="Título"
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                setErrors({ ...errors, title: validateField("title", e.target.value) });
              }}
              error={!!errors.title}
              helperText={errors.title}
              className="task-input"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Descripción"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
                setErrors({ ...errors, description: validateField("description", e.target.value) });
              }}
              error={!!errors.description}
              helperText={errors.description}
              className="task-input description-input"
              multiline
              rows={3}
              sx={{ flex: 2 }}
            />
            <Select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="task-select"
              sx={{ flex: 1 }}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En Progreso">En Progreso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </Select>
          </Box>
          <Button
            onClick={handleAddTask}
            className="add-task-button"
            variant="contained"
            sx={{ marginBottom: "20px" }}
          >
            Agregar Tarea
          </Button>

          {tasks.map((task, index) => (
            <Box
              key={index}
              className="task-item"
              sx={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography><strong>Título:</strong> {task.title}</Typography>
              <Typography><strong>Descripción:</strong> {task.description}</Typography>
              <Typography><strong>Estado:</strong> {task.status}</Typography>
            </Box>
          ))}

          <Box className="modal-actions" sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onClose} className="cancel-button" variant="outlined" color="error">
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleAddUser}
              className="save-button"
              color="primary"
            >
              Agregar Usuario
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
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddUserModal;
