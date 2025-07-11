import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const encrypted = localStorage.getItem("wallet_mnemonic");
    if (encrypted) {
      navigate("/wallet");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-3xl p-8 text-center max-w-md w-full">
        <FiLock className="mx-auto text-white mb-4" size={48} />
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Welcome
        </h1>
        <p className="text-gray-400 mb-8">
          Securely manage your Web3 assets in one single place. Ready to dive in?
        </p>
        <button
          onClick={() => navigate("/create-wallet")}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-semibold rounded-2xl shadow-lg hover:bg-gray-200 transition"
        >
          <FiLock size={20} />
          Create Wallet
        </button>
      </div>
    </div>
  );
}
