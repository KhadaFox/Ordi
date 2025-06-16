import app from "./app";

const PORT = process.env.PORT || 3001; // Porta do seu backend

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});
