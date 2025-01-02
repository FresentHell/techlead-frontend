import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Cambia esto si tu backend está en otro puerto
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
