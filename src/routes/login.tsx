import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LoginView from "../views/LoginView/LoginView";
import { useAuth } from "../hooks/useAuth";
import LoadingView from "../views/LoadingView/LoadingView";

export const Route = createFileRoute("/login")({
  component: Login,
});

export type LoginModes = "login" | "signup";
export type LoginPageStatus =
  | "Loading"
  | "Idle"
  | "SignIn"
  | "ConfirmEmail"
  | "LoadingSignIn";

export default function Login() {
  const [pageStatus, setPageStatus] = useState<LoginPageStatus>("Loading");
  const [mode, setMode] = useState<LoginModes>("login");

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "Unauthenticated") {
      setPageStatus("Idle");
    } else if (auth.status === "Initializing") {
      auth.checkUserSession();
    }
  }, [auth.status]);

  const handleAuth = async (email: string, password: string) => {
    setPageStatus("LoadingSignIn");

    if (mode === "login") {
      auth.signIn({ email, password });
      navigate({ to: "/home" });
    } else {
      const result = await auth.signUp({ email, password });

      if (result.status === "signin") {
        setPageStatus("SignIn");
      } else if (result.status === "confirmEmail") {
        setPageStatus("ConfirmEmail");
      } else {
        setPageStatus("Idle");
      }
    }
  };

  const handleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  if (pageStatus === "Loading") {
    return <LoadingView />;
  } else {
    return (
      <LoginView
        mode={mode}
        pageStatus={pageStatus}
        handleAuth={handleAuth}
        handleMode={handleMode}
      />
    );
  }
}
