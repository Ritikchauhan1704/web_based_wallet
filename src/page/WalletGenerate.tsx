import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const SECRET_KEY = "my_secret_key";

export default function WalletGenerate() {
  const [memonics, setMemonics] = useState<string>();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateMem = () => {
    const mn = generateMnemonic();
    const encrypted = CryptoJS.AES.encrypt(mn, SECRET_KEY).toString();
    localStorage.setItem("wallet_mnemonic", encrypted);
    setMemonics(mn);
    setCopied(false);
  };

  const handleCopy = () => {
    if (memonics) {
      navigator.clipboard.writeText(memonics);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const goToWallet = () => {
    navigate("/wallet");
  };
  useEffect(() => {
    const encrypted = localStorage.getItem("wallet_mnemonic");
    if (encrypted) {
      navigate("/wallet");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full text-white">
        {memonics ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Seed Phrase</h2>
            <div className="border-2 border-white rounded-xl p-4 font-mono text-sm mb-4 break-words text-center">
              {memonics}
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleCopy}
                className="w-full py-3 rounded-xl border-2 border-white bg-white text-black font-semibold hover:bg-transparent hover:text-white transition"
              >
                {copied ? "Copied!" : "Copy Seed"}
              </button>
              <button
                onClick={goToWallet}
                className="w-full py-3 rounded-xl border-2 border-white bg-transparent text-white font-semibold hover:bg-white hover:text-black transition"
              >
                Go to Wallet
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Keep your seed phrase safe and never share it with anyone.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold mb-6">Welcome</h2>
            <p className="text-gray-400 mb-8">
              Generate a new wallet seed phrase to get started.
            </p>
            <button
              onClick={generateMem}
              className="w-full py-4 rounded-2xl border-2 border-white bg-white text-black font-semibold hover:bg-transparent hover:text-white transition"
            >
              Create Seed Phrase
            </button>
          </>
        )}
      </div>
    </div>
  );
}
