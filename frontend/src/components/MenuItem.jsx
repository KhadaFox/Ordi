// src/components/MenuItem.jsx
import React from "react";

export default function MenuItem({ item, onClick }) {
  let priceDisplay = "";

  // Verifica se o item tem variantes e se o array de variantes não está vazio
  if (item.variantes && item.variantes.length > 0) {
    // Se tiver variantes, mostra "A partir de" o preço da primeira variante
    priceDisplay = `A partir de R$ ${item.variantes[0].price
      .toFixed(2)
      .replace(".", ",")}`;
  } else if (item.price !== undefined) {
    // Adicionamos esta condição para garantir que item.price existe
    // Se não tiver variantes E o preço estiver definido, mostra o preço fixo do item
    priceDisplay = `R$ ${item.price.toFixed(2).replace(".", ",")}`;
  } else {
    // Caso raro, se não tiver variantes e nem preço definido (um fallback)
    priceDisplay = "Preço não disponível";
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick} // Este clique abre o modal de detalhes do item
    >
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full object-cover" />
      )}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-md font-bold text-[#980202]">
            {priceDisplay}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-[#690404] text-white text-sm px-3 py-1 rounded-full hover:bg-[#b96464] transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
