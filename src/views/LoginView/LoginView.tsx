import { useState } from "react";
import PageWrapper from "../PageWrapper/PageWrapper";

const LoginView = ({
  mode,
  message,
  handleAuth,
  handleMode,
}: {
  mode: "login" | "signup";
  message: string;
  handleAuth: (email: string, password: string) => Promise<void>;
  handleMode: () => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onHandleClick = () => {
    handleAuth(email, password);
  };

  return (
    <PageWrapper>
      <div className="flex max-w-sm mx-auto p-6 border rounded shadow bg-white">
        <div className="flex flex-col flex-1 justify-center items-center">
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
            onClick={onHandleClick}
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
              onClick={() => handleMode()}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

          {message && <p className="text-red-500 mt-3">{message}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginView;
