"use client";

import { Box, Modal, Typography, Button } from "@mui/material";

interface ConfirmDeleteModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  userName,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: "8px",
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6">¿Estás seguro?</Typography>
        <Typography>
          Estás a punto de eliminar al usuario con nombre: <strong>{userName}</strong>.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Eliminar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
