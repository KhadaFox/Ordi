export default function MenuItem({ item, onAdd, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition"
      onClick={() => onClick && onClick(item)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="object-cover rounded-md"
      />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-base text-[#4d5940]">
            {item.name}
          </h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {item.description || ""}
          </p>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm font-medium text-[#4d5940]">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </span>
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // impede o clique no botão de abrir modal
                onAdd(item);
              }}
              className="text-xs bg-[#4d5940] text-white px-3 py-1 rounded-full hover:bg-[#6d7960] transition-all"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
