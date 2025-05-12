const Payment = () => {
  return (
    <div className="min-h-screen bg-[#faefda] p-6">
      <h2 className="text-2xl font-semibold text-[#4d5940] mb-4">Pagamento</h2>
      <p className="text-gray-700 mb-4">Escolha a forma de pagamento:</p>
      <div className="flex gap-4">
        <button className="bg-[#4d5940] text-white py-2 px-4 rounded">
          Pix
        </button>
        <button className="bg-[#4d5940] text-white py-2 px-4 rounded">
          Crédito
        </button>
        <button className="bg-[#4d5940] text-white py-2 px-4 rounded">
          Débito
        </button>
      </div>
    </div>
  );
};

export default Payment;
