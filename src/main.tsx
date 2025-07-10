import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import WalletGenerate from "./page/WalletGenerate.tsx";
import ChooseBlockChain from "./page/ChooseBlockchain.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<ChooseBlockChain />} />
      <Route path="create-wallet/:id" element={<WalletGenerate />} />
    </Route>
  )
);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
