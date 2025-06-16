import CartItem from "../components/CartItem";

const Cart = () => {
  const cartItems = [];

  return (
    <div className="min-h-screen bg-[#faefda] p-4">
      <h2 className="text-2xl font-semibold text-[#690404] mb-4">Carrinho</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} onRemove={() => {}} />
        ))
      )}
    </div>
  );
};

export default Cart;
