// src/pages/ComandaEntry.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ComandaEntry() {
  const navigate = useNavigate();
  const location = useLocation();

  const [comandaId, setComandaId] = useState("");
  const [numeroMesa, setNumeroMesa] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idComandaFromUrl = params.get("comandaId");
    const numMesaFromUrl = params.get("numeroMesa"); // Manter para compatibilidade, mas o foco é 'comandaId'

    if (idComandaFromUrl) {
      setComandaId(idComandaFromUrl);
    } else {
      // Se não veio comandaId na URL, significa que o QR Code é genérico.
      // Neste cenário, você pode decidir como lidar:
      // 1. Alertar que o QR Code está incompleto e pedir para escanear novamente.
      // 2. Ou, permitir que o cliente digite o comandaId manualmente (com o campo habilitado).
      // Para este caso, vamos assumir que o comandaId é esperado da URL.
      alert(
        "Erro: ID da Comanda não encontrado no QR Code. Por favor, escaneie um QR Code válido."
      );
      // Opcional: Redirecionar para uma página de erro ou instrução se o QR Code estiver incompleto.
      // navigate('/qr-code-invalido');
    }

    if (numMesaFromUrl) {
      setNumeroMesa(numMesaFromUrl);
    }

    setLoading(false);
  }, [location.search, navigate]); // Adicionado navigate para o array de dependências do useEffect

  const handleContinue = () => {
    // Validação principal: comandaId DEVE vir da URL
    if (!comandaId.trim()) {
      alert(
        "O ID da Comanda deve ser fornecido via QR Code. Por favor, escaneie novamente."
      );
      return;
    }
    // Validação: numeroMesa deve ser preenchido pelo cliente
    if (!numeroMesa.trim()) {
      alert("Por favor, insira o Número da Mesa.");
      return;
    }

    navigate(
      `/menu?comandaId=${comandaId.trim()}&numeroMesa=${numeroMesa.trim()}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
        <p className="text-xl text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF0E1] p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#980202] mb-6">
          Seu Pedido Digital Ordi!
        </h1>

        {/* Campo para ID da Comanda - Agora sempre preenchido via QR Code e desabilitado */}
        <div className="mb-4">
          <label
            htmlFor="comandaId"
            className="block text-left text-sm font-medium text-gray-700 mb-2"
          >
            Comanda ID:
          </label>
          <input
            type="text"
            id="comandaId"
            value={comandaId}
            readOnly // Torna o campo somente leitura, pois deve vir do QR Code
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-lg"
            // Removido disabled={!!location.search.includes('comandaId')} pois readOnly já faz o trabalho visual
          />
        </div>

        {/* Campo para Número da Mesa - Este será o campo que o cliente preenche */}
        <div className="mb-6">
          <label
            htmlFor="numeroMesa"
            className="block text-left text-sm font-medium text-gray-700 mb-2"
          >
            Número da Mesa:
          </label>
          <input
            type="text"
            id="numeroMesa"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            placeholder="Digite o número da sua mesa"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#980202] text-lg"
            // Não desabilitamos este, pois é o cliente quem preenche
          />
        </div>

        {/* Botão para continuar */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#980202] text-white font-semibold py-3 px-6 rounded-lg text-xl hover:bg-[#b96464] transition-colors duration-300"
        >
          Acessar Cardápio
        </button>
      </div>
    </div>
  );
}
