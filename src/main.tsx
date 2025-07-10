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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="create-wallet" element={<WalletGenerate />} />
    </Route>
  )
);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
