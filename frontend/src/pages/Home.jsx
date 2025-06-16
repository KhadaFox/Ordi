import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <img className=" h-50" src="./public/Ordi.png"></img>
      <div className=" flex flex-col items-center mt-25 px-6">
        <h1 className="text-4xl font-bold text-[#980202] mb-5">Bem-vindo(a)</h1>
        <p className="text-center text-gray-700 max-w-md mb-6">
          Sente-se, escolha o que deseja e finalize seu pedido sem sair da mesa.
        </p>
        <Link
          to="/menu"
          className="mt-25 text-amber-50 bg-[#980202] px-4 py-4 rounded hover:bg-[#b96464] text-3xl"
        >
          Ver Cardápio
        </Link>
      </div>
    </div>
  );
};

export default Home;
