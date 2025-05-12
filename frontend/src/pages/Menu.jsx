import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import MenuItem from "../components/MenuItem";
import CartItem from "../components/CartItem";
import ItemModal from "../components/ItemModal";
import menuItems from "../data/menuData";

const categories = [
  "Todos",
  ...new Set(menuItems.map((item) => item.category)),
];

export default function Menu() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedBySubcategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.subcategory]) acc[item.subcategory] = [];
    acc[item.subcategory].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item) => {
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      setCart((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleIncrement = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#faefda] text-black relative">
      {/* Header */}
      <header className="bg-[#4d5940] text-white px-4 py-6 rounded-b-xl relative">
        <p className="text-sm">Café Arrumado</p>
        <h1 className="text-2xl font-semibold">Seja Bem-vindo!</h1>

        <div className="relative mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qual comida você está procurando?"
            className="w-full rounded-full py-2 pl-10 pr-4 text-sm text-white bg-[#6d7960] placeholder:text-white/80"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white" />
        </div>

        <button
          onClick={() => setShowCart(!showCart)}
          className="absolute top-6 right-4 flex items-center gap-1"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          {totalItems > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Categorias */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 bg-[#faefda]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm transition-all ${
              selectedCategory === cat
                ? "bg-[#6d7960] text-white"
                : "bg-[#4d5940] text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cardápio */}
      <div className="px-4 pb-8">
        <h2 className="text-3xl font-bold text-[#4d5940] mt-2 mb-4">
          Cardápio
        </h2>

        {Object.entries(groupedBySubcategory).map(([subcat, items]) => (
          <div key={subcat} className="mb-6">
            <h3 className="text-2xl font-semibold text-[#4d5940] mb-2">
              {subcat}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onAdd={() => handleAddToCart(item)}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalhes */}
      {showModal && selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setShowModal(false);
          }}
          onAdd={() => handleAddToCart(selectedItem)}
        />
      )}

      {/* Carrinho flutuante */}
      {showCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
          <h4 className="font-bold text-[#4d5940] mb-2">Carrinho</h4>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum item no carrinho.</p>
          ) : (
            <>
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              ))}
              <div className="flex justify-between mt-4 text-[#4d5940] font-semibold">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>

              <button
                onClick={() => {
                  setShowCheckout(true);
                  setShowCart(false);
                }}
                className="w-full mt-4 bg-[#4d5940] text-white text-sm py-2 rounded-full hover:bg-[#6d7960] transition-all"
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal de Finalização */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-5">
            <h3 className="text-xl font-bold text-[#4d5940] mb-4">
              Finalizar Pedido
            </h3>

            <div className="max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm mb-2"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>
                    R${" "}
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Alguma observação? (opcional)"
              className="w-full mt-4 p-2 border rounded-md text-sm"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            <div className="flex justify-between mt-4 items-center">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await fetch("http://localhost:3333/pedidos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      mesa:
                        new URLSearchParams(window.location.search).get(
                          "mesa"
                        ) || "desconhecida",
                      itens: cart,
                      observacoes,
                      total: totalPrice,
                    }),
                  });

                  setShowCheckout(false);
                  setCart([]);
                  setObservacoes("");
                  setShowCart(false);
                  alert("Pedido enviado com sucesso!");
                }}
                className="bg-[#4d5940] text-white px-4 py-2 rounded-md text-sm"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
