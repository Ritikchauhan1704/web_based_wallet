import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import CryptoJS from "crypto-js";
import { HDNodeWallet } from "ethers";

const SECRET_KEY = "my_secret_key";

export default function Wallet() {
  const navigate = useNavigate();

  // indices for each chain
  const [solIndex, setSolIndex] = useState(0);
  const [ethIndex, setEthIndex] = useState(0);

  // derived keys
  const [solKeys, setSolKeys] = useState<PublicKey[]>([]);
  const [ethAddrs, setEthAddrs] = useState<string[]>([]);

  // on mount: decrypt mnemonic or redirect
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

  // derive Solana account
  const addSolanaAccount = async () => {
    const mnemonic = (window as any).__WALLET_MNEMONIC as string;
    const seedBuf = await mnemonicToSeed(mnemonic);
    const seedHex = seedBuf.toString("hex");

    const path = `m/44'/501'/${solIndex}'/0'`;
    const derived = derivePath(path, seedHex).key;
    const { secretKey } = nacl.sign.keyPair.fromSeed(derived);
    const kp = Keypair.fromSecretKey(secretKey);

    setSolKeys((prev) => [...prev, kp.publicKey]);
    setSolIndex((i) => i + 1);
  };

  // derive ETH account
  const addEthAccount = () => {
    const mnemonic = (window as any).__WALLET_MNEMONIC as string;
    const path = `m/44'/60'/${ethIndex}'/0'`;
    const hd = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    setEthAddrs((prev) => [...prev, hd.address]);
    setEthIndex((i) => i + 1);
  };
  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Your Multi‑Chain Wallet</h1>

      <div className="flex space-x-4 mb-12">
        <button
          onClick={addSolanaAccount}
          className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition"
        >
          + Add Solana Account
        </button>
        <button
          onClick={addEthAccount}
          className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition"
        >
          + Add ETH Account
        </button>
      </div>

      {/* Solana section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-2xl font-semibold mb-4">Solana Accounts</h2>
        {solKeys.length === 0 ? (
          <p className="text-gray-400 mb-8">No Solana accounts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solKeys.map((pk, i) => (
              <div
                key={`sol-${i}`}
                className="border-2 border-white p-4 rounded-2xl flex flex-col"
              >
                {`Account ${i + 1}`}

                <span className="font-mono text-sm break-words mb-4">
                  {pk.toBase58()}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(pk.toBase58())}
                  className="mt-auto px-4 py-2 border border-white rounded-lg text-sm hover:bg-white hover:text-black transition"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ETH section */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Ethereum Accounts</h2>
        {ethAddrs.length === 0 ? (
          <p className="text-gray-400">No ETH accounts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ethAddrs.map((addr, i) => (
              <div
                key={`eth-${i}`}
                className="border-2 border-white p-4 rounded-2xl flex flex-col"
              >
                {`Account ${i + 1}`}
                <span className="font-mono text-sm break-words mb-4">
                  {addr}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(addr)}
                  className="mt-auto px-4 py-2 border border-white rounded-lg text-sm hover:bg-white hover:text-black transition"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
