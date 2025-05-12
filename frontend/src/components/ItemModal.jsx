import { X } from "lucide-react";

export default function ItemModal({ item, onClose, onAdd }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-11/12 max-w-md shadow-lg relative overflow-hidden">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Conteúdo */}
        <img src={item.image} alt={item.name} className="w-full object-cover" />
        <div className="p-5">
          <h2 className="text-xl font-semibold text-[#4d5940]">{item.name}</h2>
          {item.description && (
            <p className="text-sm text-gray-700 mt-2">{item.description}</p>
          )}
          <p className="mt-3 text-lg font-bold text-[#4d5940]">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </p>

          <button
            onClick={onAdd}
            className="mt-4 w-full bg-[#4d5940] hover:bg-[#6d7960] text-white py-2 rounded-full text-sm transition"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
