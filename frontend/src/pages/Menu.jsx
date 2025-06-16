// src/pages/Menu.jsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import MenuItem from "../components/MenuItem";
import MiniCartPreview from "../components/MiniCartPreview";
import ItemModal from "../components/ItemModal";
// Removidas ou comentadas as importações de menuData local e localStorageManager,
// pois agora os dados vêm do backend.
// import menuItems from "../data/menuData";
// import { getMenuItems } from '../utils/localStorageManager';

import api from "../services/api"; // ESTE É O AXIOS CONFIGURADO PARA SEU BACKEND
import { useLocation, useNavigate } from "react-router-dom";

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  const [comandaId, setComandaId] = useState(null);
  const [numeroMesa, setNumeroMesa] = useState(null);

  // Estado para os itens do cardápio carregados do SEU BACKEND
  const [currentMenuItems, setCurrentMenuItems] = useState([]);

  // Efeito para carregar os parâmetros da URL (comandaId e numeroMesa)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idComanda = params.get("comandaId");
    const numMesa = params.get("numeroMesa");

    if (idComanda && numMesa) {
      setComandaId(idComanda);
      setNumeroMesa(numMesa);
    } else {
      // Se faltarem informações, alerta e redireciona para a tela de entrada da comanda
      alert(
        "Informações da comanda ou mesa faltando. Por favor, reinicie o processo escaneando o QR Code novamente."
      );
      navigate("/comanda-entry");
    }
  }, [location.search, navigate]);

  // Efeito para CARREGAR OS PRODUTOS DO SEU BACKEND
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Faz uma requisição GET para o endpoint /products do SEU BACKEND
        const response = await api.get("/products");
        setCurrentMenuItems(response.data); // Atualiza o estado com os produtos recebidos
      } catch (error) {
        console.error("Erro ao carregar produtos do backend:", error);
        alert(
          "Não foi possível carregar o cardápio. Por favor, tente novamente mais tarde."
        );
      }
    };

    loadProducts();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem do componente

  // Filtra itens com base na pesquisa e categoria selecionada
  const filteredItems = currentMenuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupa itens filtrados por subcategoria
  const groupedBySubcategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.subcategory]) acc[item.subcategory] = [];
    acc[item.subcategory].push(item);
    return acc;
  }, {});

  // Regenera as categorias dinamicamente com base nos produtos carregados
  const categories = [
    "Todos",
    ...new Set(currentMenuItems.map((item) => item.category)),
  ];

  /**
   * Adiciona um item (com ou sem variante) e sua quantidade ao carrinho.
   */
  const handleAddToCart = (product, selectedVariant, quantityToAdd) => {
    const variantId = selectedVariant.id;
    const variantName = selectedVariant.name;
    const priceToAdd = selectedVariant.price;

    const cartItemId = `${product.id}-${variantId}`; // ID único para o item no carrinho (produtoId-varianteId)

    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.cartItemId === cartItemId
    );

    if (existingItemIndex !== -1) {
      // Se o item já existe no carrinho, atualiza a quantidade
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantityToAdd;
      setCart(newCart);
    } else {
      // Se não existe, adiciona como um novo item
      setCart([
        ...cart,
        {
          cartItemId: cartItemId,
          id: product.id,
          name: product.name,
          variantId: variantId,
          variant: variantName,
          price: priceToAdd,
          quantity: quantityToAdd,
          image: selectedVariant.image || product.image, // Usa a imagem da variante ou do produto
        },
      ]);
    }
  };

  /**
   * Remove um item completamente do carrinho.
   */
  const handleRemoveItem = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== itemToRemove.cartItemId)
    );
  };

  /**
   * Incrementa a quantidade de um item específico no carrinho.
   */
  const handleIncrement = (productId, variantId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /**
   * Decrementa a quantidade de um item específico no carrinho, removendo-o se a quantidade for 0.
   */
  const handleDecrement = (productId, variantId) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.id === productId && item.variantId === variantId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove o item se a quantidade for 0 ou menos
    );
  };

  // Calcula o total de itens no carrinho
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  // Calcula o preço total do carrinho
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /**
   * Função para ENVIAR O PEDIDO PARA O SEU BACKEND.
   */
  const enviarPedido = async () => {
    // Valida se as informações da comanda/mesa estão presentes
    if (!comandaId || !numeroMesa) {
      alert(
        "Erro: Informações da comanda ou mesa incompletas. Por favor, recarregue a página."
      );
      return;
    }
    // Valida se há itens no carrinho
    if (cart.length === 0) {
      alert("Seu pedido está vazio. Adicione produtos antes de finalizar.");
      return;
    }

    // Prepara o payload do pedido no formato que SEU BACKEND espera
    const pedidoParaSeuBackend = {
      comandaId: comandaId,
      numeroMesa: numeroMesa,
      itens: cart.map((item) => ({
        productId: item.id,
        variantId: item.variantId, // Pode ser null/undefined se o produto não tiver variantes
        quantity: item.quantity,
        priceUnit: item.price,
        name: item.name,
        variantName: item.variant !== "Padrão" ? item.variant : undefined, // Envia nome da variante se não for "Padrão"
        // Você pode adicionar mais campos aqui se seu backend precisar (ex: observacoesItem)
      })),
      observacoesGerais: observacoes,
      totalComanda: totalPrice,
    };

    try {
      // Faz a requisição POST para o endpoint /orders do SEU BACKEND
      await api.post("/orders", pedidoParaSeuBackend);
      alert(
        `Pedido enviado com sucesso para a Comanda ${comandaId} da Mesa ${numeroMesa}!`
      );
      setCart([]); // Limpa o carrinho local após o envio
      setObservacoes(""); // Limpa as observações
      setShowCheckout(false); // Fecha o modal de checkout
      // Opcional: Redirecionar o cliente para uma tela de confirmação de pedido
      // navigate('/pedido-enviado-sucesso', { state: { comandaId, numeroMesa } });
    } catch (error) {
      console.error("Erro ao enviar pedido para o seu backend:", error);
      // Exibe uma mensagem de erro mais amigável para o usuário
      alert(
        "Erro ao enviar pedido. Por favor, tente novamente ou chame um funcionário."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-black relative">
      <header className="bg-[#980202] text-white px-4 py-6 rounded-b-xl relative">
        <p className="text-sm">Ordi</p>
        <h1 className="text-2xl font-semibold">Seja Bem-vindo!</h1>
        {/* Exibe o ID da comanda e o número da mesa, se disponíveis */}
        {comandaId && numeroMesa && (
          <p className="text-sm text-white/80 mt-1">
            Comanda: {comandaId} | Mesa: {numeroMesa}
          </p>
        )}

        {/* Campo de pesquisa de produtos */}
        <div className="relative mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qual comida você está procurando?"
            className="w-full rounded-full py-2 pl-10 pr-4 text-sm text-white bg-[#690404] placeholder:text-white/80"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white" />
        </div>
      </header>

      {/* Botões de filtro por categoria */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 bg-[#ffffff]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm transition-all ${
              selectedCategory === cat
                ? "bg-[#690404] text-white" // Estilo para categoria selecionada
                : "bg-[#980202] text-white" // Estilo para outras categorias
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Seção do Cardápio */}
      <div className="px-4 pb-[150px]">
        <h2 className="text-3xl font-bold text-[#690404] mt-2 mb-4">
          Cardápio
        </h2>

        {/* Mapeia e exibe os produtos agrupados por subcategoria */}
        {Object.entries(groupedBySubcategory).map(([subcat, items]) => (
          <div key={subcat} className="mb-6">
            <h3 className="text-2xl font-semibold text-[#690404] mb-2">
              {subcat}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        {/* Mensagem se não houver produtos carregados ou filtrados */}
        {currentMenuItems.length === 0 && (
          <p className="text-center text-gray-500">
            Carregando cardápio ou nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* Modal de Detalhes do Item */}
      {showModal && selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setShowModal(false);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Preview do Mini Carrinho (aparece na parte inferior) */}
      <MiniCartPreview
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onRemove={handleRemoveItem}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onCheckoutClick={() => {
          setShowCheckout(true);
        }}
        onClose={() => setCart([])} // O que acontece quando o mini carrinho é "fechado" (limpado)
      />

      {/* Modal de Checkout (finalização do pedido) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-[#000000e5] flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-5">
            <h3 className="text-xl font-bold text-[#690404] mb-4">
              Finalizar Pedido
            </h3>

            {/* Lista dos itens no carrinho para revisão */}
            <div className="max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.variantId}`}
                  className="flex justify-between text-sm mb-2"
                >
                  <span>
                    {item.name}{" "}
                    {item.variant !== "Padrão" ? `(${item.variant})` : ""} x
                    {item.quantity}
                  </span>
                  <span>
                    R${" "}
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>

            {/* Campo para observações gerais do pedido */}
            <textarea
              placeholder="Alguma observação? (opcional)"
              className="w-full mt-4 p-2 border rounded-md text-sm"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            {/* Botões de cancelar e enviar pedido */}
            <div className="flex justify-between mt-4 items-center">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-sm text-gray-600 underline"
              >
                Cancelar
              </button>
              <button
                onClick={enviarPedido}
                className="bg-[#690404] text-white py-2 px-4 rounded-full text-sm hover:bg-[#b96464] transition-all"
              >
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
