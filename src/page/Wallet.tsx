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
  const [solIndex, setSolIndex] = useState(0);
  const [ethIndex, setEthIndex] = useState(0);
  const [solKeys, setSolKeys] = useState<PublicKey[]>([]);
  const [ethAddrs, setEthAddrs] = useState<string[]>([]);
  const [copiedSol, setCopiedSol] = useState<number | null>(null);
  const [copiedEth, setCopiedEth] = useState<number | null>(null);

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

  const addSolanaAccount = async () => {
    const mnemonic = (window as any).__WALLET_MNEMONIC as string;
    const seedBuf = await mnemonicToSeed(mnemonic);
    const seedHex = seedBuf.toString("hex");
    const path = `m/44'/501'/${solIndex}'/0'`;
    const derived = derivePath(path, seedHex).key;
    const { secretKey } = nacl.sign.keyPair.fromSeed(derived);
    const kp = Keypair.fromSecretKey(secretKey);
    setSolKeys(prev => [...prev, kp.publicKey]);
    setSolIndex(i => i + 1);
  };

  const addEthAccount = () => {
    const mnemonic = (window as any).__WALLET_MNEMONIC as string;
    const path = `m/44'/60'/${ethIndex}'/0'`;
    const hd = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    setEthAddrs(prev => [...prev, hd.address]);
    setEthIndex(i => i + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-3xl p-8 w-full max-w-5xl text-white">
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Your Multi‑Chain Wallet
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={addSolanaAccount}
            className="flex-1 py-3 border-2 border-white rounded-2xl bg-white text-black font-semibold hover:bg-transparent hover:text-white transition"
          >
            + Add Solana Account
          </button>
          <button
            onClick={addEthAccount}
            className="flex-1 py-3 border-2 border-white rounded-2xl bg-white text-black font-semibold hover:bg-transparent hover:text-white transition"
          >
            + Add Ethereum Account
          </button>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Solana Accounts</h2>
          {solKeys.length === 0 ? (
            <p className="text-gray-400">No Solana accounts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
              {solKeys.map((pk, i) => (
                <div
                  key={`sol-${i}`}
                  className="bg-white bg-opacity-10 p-5 rounded-2xl flex flex-col"
                >
                  <span className="font-mono text-sm mb-2">
                    {`Account ${i + 1}`}
                  </span>
                  <span className="font-mono text-xs break-words mb-4">
                    {pk.toBase58()}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pk.toBase58());
                      setCopiedSol(i);
                      setTimeout(() => setCopiedSol(null), 1500);
                    }}
                    className="mt-auto py-2 border border-white rounded-lg font-medium hover:bg-white hover:text-black transition"
                  >
                    {copiedSol === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Ethereum Accounts</h2>
          {ethAddrs.length === 0 ? (
            <p className="text-gray-400">No ETH accounts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
              {ethAddrs.map((addr, i) => (
                <div
                  key={`eth-${i}`}
                  className="bg-white bg-opacity-10 p-5 rounded-2xl flex flex-col"
                >
                  <span className="font-mono text-sm mb-2">
                    {`Account ${i + 1}`}
                  </span>
                  <span className="font-mono text-xs break-words mb-4">
                    {addr}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(addr);
                      setCopiedEth(i);
                      setTimeout(() => setCopiedEth(null), 1500);
                    }}
                    className="mt-auto py-2 border border-white rounded-lg font-medium hover:bg-white hover:text-black transition"
                  >
                    {copiedEth === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
