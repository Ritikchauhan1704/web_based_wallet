import { generateMnemonic } from "bip39";
import { useState } from "react";
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="max-w-lg w-full bg-white bg-opacity-5 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {memonics ? (
          <div className="w-full mb-4">
            <div className="border-2 border-white rounded-xl p-4 text-lg font-mono flex flex-col items-center relative">
              <span className="break-words text-center select-all ">
                {memonics}
              </span>
              <button
                className="w-full py-4 mt-6 rounded-xl border-2 border-white bg-black hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg text-white"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className="w-full py-4 mt-4 rounded-xl border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-colors font-bold text-xl shadow-lg"
                onClick={goToWallet}
              >
                Go to Wallet
              </button>
            </div>
            <p className="text-xs mt-2 text-center ">
              Keep your seed phrase safe and never share it with anyone.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight ">
              Generate Wallet Seed Phrase
            </h2>
            <button
              className="w-full py-4 rounded-xl border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-white bg-black"
              onClick={generateMem}
            >
              Create Seed Phrase
            </button>
          </>
        )}
      </div>
    </div>
  );
}
