import { ShoppingCart } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#4d5940] text-white px-4 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Cardápio</h1>
      <ShoppingCart className="w-6 h-6" />
    </header>
  );
};

export default Header;
