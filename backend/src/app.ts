import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes"; // Importe a nova rota de produtos

dotenv.config(); // Carrega as variáveis de ambiente

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware CORS para permitir requisições do seu frontend
// Em produção, configure o origin para a URL do seu frontend:
// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors()); // Permite todas as origens em desenvolvimento

// Rotas da API
// Todas as suas rotas terão o prefixo '/api'
app.use("/api", orderRoutes);
app.use("/api", productRoutes); // Adicione as rotas de produtos

export default app;
