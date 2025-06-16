// CartItem.jsx
import { Fragment } from "react";
import { Trash2, X } from "lucide-react"; // Importe o ícone X para fechar

export default function CartItem({
  cart = [],
  onRemove,
  onIncrement,
  onDecrement,
  onCheckoutClick,
  onClose,
}) {
  // <-- Adicione onClose aqui
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    // Removido 'p-4' da div principal aqui, pois o container pai já lida com o espaçamento lateral
    <div className="flex flex-col h-full relative">
      {" "}
      {/* Adicionado 'relative' para posicionar o botão de fechar */}
      {/* Botão de fechar a sidebar */}
      <button
        onClick={onClose} // Chama a prop onClose
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
      >
        <X size={24} />
      </button>
      <h2 className="text-xl font-semibold text-[#980202] mb-4 p-4">
        {" "}
        {/* Adicionado p-4 para o título */}
        Seu Carrinho
      </h2>
      {cart.length === 0 ? (
        <p className="text-gray-600 flex-grow flex items-center justify-center">
          Seu carrinho está vazio.
        </p>
      ) : (
        <div className="flex-grow overflow-y-auto px-4 pr-1 space-y-4">
          {" "}
          {/* Adicionado px-4 para padding lateral */}
          {cart.map((item) => (
            <Fragment key={`${item.id}-${item.variant}`}>
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="text-base font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tamanho: {item.variant}
                  </p>
                  <p className="text-sm text-gray-800 font-semibold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDecrement(item.id, item.variant)}
                    className="text-gray-600 hover:text-gray-800 text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onIncrement(item.id, item.variant)}
                    className="text-gray-600 hover:text-gray-800 text-lg font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
      {/* Total e botão de finalizar - ficam fixos no final do carrinho */}
      <div className="pt-4 border-t mt-4 p-4">
        {" "}
        {/* Adicionado p-4 para o rodapé */}
        <div className="flex justify-between text-lg font-semibold text-gray-800 mb-3">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-[#980202] hover:bg-[#b96464] text-white py-3 rounded-full text-lg font-semibold transition duration-200"
          onClick={onCheckoutClick}
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}
