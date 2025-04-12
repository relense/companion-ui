import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const Route = createFileRoute("/login")({
  component: App,
});

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
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

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">
        {mode === "login" ? "Login" : "Sign Up"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-3 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>

      <p className="text-sm mt-4 text-center">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          className="text-blue-500 underline"
          onClick={() =>
            setMode((prev) => (prev === "login" ? "signup" : "login"))
          }
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>

      {message && <p className="text-red-500 mt-3">{message}</p>}
    </div>
  );
}
