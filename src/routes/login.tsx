import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LoginView from "../views/LoginView/LoginView";
import { useAuth } from "../hooks/useAuth";
import LoadingView from "../views/LoadingView/LoadingView";

export const Route = createFileRoute("/login")({
  component: Login,
});

export type LoginModes = "login" | "signup";

export default function Login() {
  const [pageStatus, setPageStatus] = useState<"Loading" | "Idle">("Loading");
  const [mode, setMode] = useState<LoginModes>("login");
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);

    if (mode === "login") {
      auth.signIn({ email, password });
    } else {
      auth.signUp({ email, password });
    }

    navigate({ to: "/home" });

    setLoading(false);
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
        handleAuth={handleAuth}
        handleMode={handleMode}
        loading={loading}
      />
    );
  }
}
