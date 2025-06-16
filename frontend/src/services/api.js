// src/services/api.js (ou .ts)

import axios from "axios";

// A URL base AGORA DEVE SER A DO SEU BACKEND (onde ele está rodando, ex: porta 3001)
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001/api";
// Se você está usando Vite, 'import.meta.env.VITE_BACKEND_API_URL' é a forma de acessar variáveis de ambiente.
// Crie um arquivo .env.local na raiz do seu frontend com VITE_BACKEND_API_URL=http://localhost:3001

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
