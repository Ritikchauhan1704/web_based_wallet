import { generateMnemonic } from "bip39";
import { useState } from "react";

export default function WalletGenerate() {
  const [memonics, setMemonics] = useState<string>();
  const [copied, setCopied] = useState(false);

  const generateMem = () => {
    const mn = generateMnemonic();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="max-w-lg w-full bg-white bg-opacity-5 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {memonics ? (
          <div className="w-full mb-4">
            <div className=" border-2 border-white rounded-xl p-4 text-lg font-mono flex flex-col items-center relative">
              <span className="break-words text-center select-all">
                {memonics}
              </span>
              <button
                className="w-full py-4 rounded-xl border-2 border-white bg-black hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs mt-2 text-center text-white">
              Keep your seed phrase safe and never share it with anyone.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight ">
              Generate Wallet Seed Phrase
            </h2>
            <button
              className="w-full py-4 rounded-xl border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white "
              
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
