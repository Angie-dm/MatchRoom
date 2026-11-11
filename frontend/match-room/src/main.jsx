import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PwaPrompt from "./components/PwaPrompt";
import ConnectionStatus from "./components/ConnectionStatus";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { markAppShellVisited } from "./services/appShellStorage";
import "./styles/index.css";

markAppShellVisited();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ConnectionStatus />
        <PwaPrompt />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
