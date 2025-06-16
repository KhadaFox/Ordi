import React from "react";
import { ShoppingCart, X, Trash2 } from "lucide-react"; // Importe os ícones necessários

export default function MiniCartPreview({
  cart,
  totalItems,
  totalPrice,
  onClose, // Função para fechar o modal (recebida do Menu.jsx)
  onIncrement, // Função para incrementar a quantidade de um item (recebida do Menu.jsx)
  onDecrement, // Função para decrementar a quantidade de um item (recebida do Menu.jsx)
  onRemove, // Função para remover um item do carrinho (recebida do Menu.jsx)
  onCheckoutClick, // Função para ir para a tela de checkout (recebida do Menu.jsx)
}) {
  const isEmpty = totalItems === 0;

  // A classe 'translate-y-full' esconde o modal para baixo.
  // A classe 'translate-y-0' mostra o modal na posição normal.
  // A transição será suave devido a 'transition-transform duration-300 ease-in-out'.
  // O modal se esconde automaticamente se o carrinho estiver vazio.
  // Se quiser que ele apareça com 0 itens e apenas com o cabeçalho 'Seu Carrinho',
  // você precisaria de um estado 'isOpen' vindo do Menu.jsx e usá-lo aqui.
  // Por enquanto, ele aparece só se tiver itens, ou se o totalItens for 0 e você quiser mostrar
  // a mensagem "carrinho vazio" dentro dele.
  // Ajustamos a condição para que o modal esteja sempre 'presente' no DOM para animação,
  // mas 'escondido' se o carrinho estiver vazio.
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#980202] shadow-2xl z-40
                 transform transition-transform ease-in-out duration-300
                 ${isEmpty ? "translate-y-full" : "translate-y-0"}
                 `}
    >
      {/* Cabeçalho do Carrinho */}
      <div className="flex items-center justify-between p-4 pb-2 border-b">
        <h2 className="text-xl font-semibold text-[#980202]">Seu Carrinho</h2>
        <button
          onClick={onClose} // Botão de fechar o modal. Lógica de 'onClose' definida no Menu.jsx
          className="text-gray-600 hover:text-gray-900"
          aria-label="Fechar carrinho"
        >
          <X size={24} />
        </button>
      </div>

      {/* Conteúdo do Carrinho (Scroll Horizontal ou mensagem de vazio) */}
      {isEmpty ? (
        <div className="p-4 text-center text-gray-600 py-8">
          <p>Seu carrinho está vazio.</p>
          <p className="text-sm">Adicione itens para começar!</p>
        </div>
      ) : (
        <>
          {/* Seção de Scroll Horizontal dos produtos */}
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-4 py-3">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.variant}`}
                className="inline-block mx-2 text-center align-top w-[120px] pb-2" // Adicionado pb-2 para espaçamento inferior
              >
                {/* Exibindo imagem (se você tiver URLs de imagem nos seus dados) */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mx-auto mb-1"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-md mx-auto mb-1 flex items-center justify-center text-gray-500 text-xs">
                    Sem Imagem
                  </div>
                )}
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                {/* Exibe o tamanho/variante apenas se não for 'Padrão' */}
                {item.variant && item.variant !== "Padrão" && (
                  <p className="text-xs text-gray-600">{item.variant}</p>
                )}
                <p className="text-sm text-gray-800 font-semibold">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </p>

                {/* Botões de quantidade e remover para cada item */}
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <button
                    onClick={() => onDecrement(item.id, item.variant)}
                    className="text-gray-600 hover:text-gray-800 text-lg font-bold w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onIncrement(item.id, item.variant)}
                    className="text-gray-600 hover:text-gray-800 text-lg font-bold w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé do Carrinho: Total e Botão de Finalizar */}
          <div className="pt-4 px-4 pb-4 border-t mt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-3">
              <span>Total:</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>

            <button
              onClick={onCheckoutClick}
              className="w-full bg-[#980202] hover:bg-[#b96464] text-white py-3 rounded-full text-lg font-semibold transition duration-200"
            >
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}
