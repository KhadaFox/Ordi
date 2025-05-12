const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());

// Rota padrão (para testes)
app.get("/", (req, res) => {
  res.send("API do Selfood está ativa! ✅");
});

// Rota para receber pedidos
app.post("/pedidos", (req, res) => {
  const { mesa, items, observacoes } = req.body;
  console.log("📥 Novo pedido recebido:");
  console.log("🪑 Mesa:", mesa);
  console.log("🍽️ Items:", items);
  console.log("📝 Observações:", observacoes);
  res.status(200).json({ message: "Pedido recebido com sucesso!" });
});

app.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
});
