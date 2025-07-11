import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import CryptoJS from "crypto-js";

const SECRET_KEY = "my_secret_key";


export default function Wallet() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  // On mount, load & decrypt mnemonic
  useEffect(() => {
    const encrypted = localStorage.getItem("wallet_mnemonic");
    if (!encrypted) {
      navigate("/create-wallet");
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const mnemonic = bytes.toString(CryptoJS.enc.Utf8);
      if (!mnemonic) throw new Error();
      (window as any).__WALLET_MNEMONIC = mnemonic;
    } catch {
      localStorage.removeItem("wallet_mnemonic");
      navigate("/create-wallet");
    }
  }, [navigate]);

  const addAccount = () => {
    const mnemonic = (window as any).__WALLET_MNEMONIC as string;
    const seed = mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derived = derivePath(path, seed.toString()).key;
    const { secretKey } = nacl.sign.keyPair.fromSeed(derived);
    const kp = Keypair.fromSecretKey(secretKey);
    setPublicKeys([...publicKeys, kp.publicKey]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Your Wallet</h1>

      <button
        onClick={addAccount}
        className="p-4 rounded-xl border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-white bg-black"
      >
        + Add New Account
      </button>

      {publicKeys.length === 0 ? (
        <p className="text-gray-400">
          No accounts yet. Click above to add one.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {publicKeys.map((pk, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-10 p-4 rounded-2xl shadow-lg flex flex-col"
            >
                {`Account ${i + 1}`}
              <span className="font-mono text-sm break-words mb-4">
                {pk.toBase58()}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(pk.toBase58())}
                className="mt-auto px-4 py-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-lg text-sm"
              >
                Copy Address
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
