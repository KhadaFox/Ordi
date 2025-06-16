// src/components/ItemModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ItemModal({ item, onClose, onAddToCart }) {
  const hasVariants = item.variantes && item.variantes.length > 0;

  // Estado para a variante selecionada.
  // Inicializamos com null para que o useEffect configure a variante inicial.
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1); // Estado para a quantidade

  // Efeito para definir a variante selecionada padrão e resetar a quantidade
  useEffect(() => {
    if (hasVariants) {
      // Se houver variantes, selecione a primeira variante por padrão
      setSelectedVariant(item.variantes[0]);
    } else {
      // Se não houver variantes, o próprio item é a "variante"
      setSelectedVariant(item);
    }
    setQuantity(1); // Reseta a quantidade ao abrir para um novo item
  }, [item, hasVariants]); // Dependências: item e hasVariants

  // Função para adicionar o item (ou variante) ao carrinho
  const handleAddToCart = () => {
    if (selectedVariant) {
      // Garante que uma variante foi selecionada antes de adicionar
      onAddToCart(item, selectedVariant, quantity);
      onClose(); // Fecha o modal após adicionar
    }
  };

  // Preço a ser exibido no modal
  // Garante que selectedVariant existe antes de tentar acessar seu preço
  const displayPrice = selectedVariant ? selectedVariant.price * quantity : 0;

  // Nome a ser exibido no botão "Adicionar ao Carrinho"
  const buttonText = selectedVariant
    ? `Adicionar ${quantity}x (${selectedVariant.name}) - R$ ${displayPrice
        .toFixed(2)
        .replace(".", ",")}`
    : `Adicionar ${quantity}x - R$ ${displayPrice
        .toFixed(2)
        .replace(".", ",")}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#690404] mb-4 pr-10">
          {item.name}
        </h2>

        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
          {/* Se a variante tem imagem, use-a. Caso contrário, use a imagem do item principal. */}
          {selectedVariant && selectedVariant.image ? (
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="w-full object-cover rounded-md mb-4"
            />
          ) : item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full object-cover rounded-md mb-4"
            />
          ) : (
            <div className="w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
              Sem Imagem
            </div>
          )}

          <p className="text-gray-700 mb-4">
            {selectedVariant && selectedVariant.description
              ? selectedVariant.description
              : item.description}
          </p>

          {hasVariants && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Selecione uma opção:
              </h3>
              <div className="flex flex-wrap gap-3">
                {item.variantes.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-full border transition-all text-sm
                                ${
                                  selectedVariant &&
                                  selectedVariant.id === variant.id
                                    ? "bg-[#980202] text-white border-[#980202]"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                }`}
                  >
                    {variant.name} (R${" "}
                    {variant.price.toFixed(2).replace(".", ",")})
                  </button>
                ))}
              </div>
              {selectedVariant && selectedVariant.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedVariant.description}
                </p>
              )}
            </div>
          )}

          {/* Controle de Quantidade */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-4">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            >
              -
            </button>
            <span className="text-2xl font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Botão de Adicionar ao Carrinho - Fixo na parte inferior do modal */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#690404] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#b96464] transition-colors"
            disabled={!selectedVariant || displayPrice === 0} // Desabilita se nenhuma variante foi selecionada ou preço é 0
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
