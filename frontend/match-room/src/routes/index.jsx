import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Alojamientos from "../pages/Alojamientos";
import DetalleEspacio from "../pages/DetalleEspacio";
import Explorar from "../pages/Explorar";
import Login from "../pages/Login";
import Matches from "../pages/Matches";
import Mensajes from "../pages/Mensajes";
import PerfilPersona from "../pages/PerfilPersona";
import Soon from "../pages/Soon";
import StepBasics from "../pages/onboarding/StepBasics";
import StepBudget from "../pages/onboarding/StepBudget";
import StepRoutine from "../pages/onboarding/StepRoutine";
import StepCoexistence from "../pages/onboarding/StepCoexistence";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { element: <AuthLayout />, children: [{ path: "/login", element: <Login /> }] },
  {
    path: "/registro",
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <Navigate to="1" replace /> },
      { path: "1", element: <StepBasics /> },
      { path: "2", element: <StepBudget /> },
      { path: "3", element: <StepRoutine /> },
      { path: "4", element: <StepCoexistence /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/explorar", element: <Explorar /> },
      { path: "/explorar/:id", element: <PerfilPersona /> },
      { path: "/alojamientos", element: <Alojamientos /> },
      { path: "/alojamientos/:id", element: <DetalleEspacio /> },
      { path: "/matches", element: <Matches /> },
      { path: "/mensajes/:id?", element: <Mensajes /> },
      { path: "/perfil", element: <Soon title="Mi perfil" /> },
    ],
  },
]);