import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import LoginView from "../views/LoginView/LoginView";

export const Route = createFileRoute("/login")({
  component: App,
});

export default function App() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  const handleAuth = async (email: string, password: string) => {
    setMessage("");

    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                userRole: "CLIENT",
              },
            },
          });

    if (error) {
      setMessage(error.message);
    } else {
      const token = data?.session?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        setMessage("🎉 Auth success! Token saved.");
      } else {
        setMessage("Check your email to confirm.");
      }
    }
  };

  const handleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <LoginView
      mode={mode}
      message={message}
      handleAuth={handleAuth}
      handleMode={handleMode}
    />
  );
}
