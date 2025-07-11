import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ChooseBlockChain, Wallet, WalletGenerate } from "./page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<ChooseBlockChain />} />
      <Route path="create-wallet/:id" element={<WalletGenerate />} />
      <Route path="wallet" element={<Wallet />} />
    </Route>
  )
);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
