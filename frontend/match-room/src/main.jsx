import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PwaPrompt from "./components/PwaPrompt";
import { router } from "./routes";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <PwaPrompt />
    </GoogleOAuthProvider>
  </StrictMode>,
);