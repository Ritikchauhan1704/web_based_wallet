import { useState } from "react";
import { generateMnemonic } from "bip39";
export default function App() {
  const [memonics, setMemonics] = useState<String>();

  const generateMem = () => {
    const mn = generateMnemonic();
    setMemonics(mn);
    console.log(mn.split(" "));
  };
  return (
    <div className="">
      <h1>Welcome to web based web3 wallet</h1>
      <h4>Choose a BlockChain</h4>
      <div className="">Ethereum</div>
      <div className="">Solana</div>

      <button onClick={generateMem}>Create Seed Phrases</button>
    </div>
  );
}
