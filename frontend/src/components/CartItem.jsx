import { Minus, Plus } from "lucide-react";

const CartItem = ({ item, onIncrement, onDecrement }) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div className="flex-1">
        <p className="font-medium text-[#4d5940]">{item.name}</p>
        <small className="text-sm text-gray-600">
          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
        </small>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrement(item.id)}
          className="p-1 rounded-full bg-[#e4e4e4] hover:bg-[#d0d0d0] shadow transition-all duration-150 hover:scale-110"
          title="Diminuir"
        >
          <Minus className="w-4 h-4 text-[#4d5940]" />
        </button>

        <span className="text-sm font-semibold text-[#4d5940]">
          {item.quantity}
        </span>

        <button
          onClick={() => onIncrement(item.id)}
          className="p-1 rounded-full bg-[#e4e4e4] hover:bg-[#d0d0d0] shadow transition-all duration-150 hover:scale-110"
          title="Aumentar"
        >
          <Plus className="w-4 h-4 text-[#4d5940]" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
