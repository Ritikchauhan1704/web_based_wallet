import { useNavigate } from "react-router-dom";

export default function ChooseBlockChain() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          Web3 Wallet
        </h1>
        <h4 className="text-lg md:text-xl font-semibold mb-8 text-gray-300">
          Choose a Blockchain
        </h4>
        <div className="flex flex-col gap-6">
          <button
            className="w-full py-4 rounded-xl border-2 border-white bg-black hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => navigate("/create-wallet/eth")}
          >
            Ethereum
          </button>
          <button
            className="w-full py-4 rounded-xl border-2 border-white bg-black hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => navigate("/create-wallet/sol")}
          >
            Solana
          </button>
        </div>
      </div>
    </div>
  );
}
