import { useState } from "react";
import PageWrapper from "../PageWrapper/PageWrapper";

const LoginView = ({
  mode,
  handleAuth,
  handleMode,
  loading,
}: {
  mode: "login" | "signup";
  handleAuth: (email: string, password: string) => Promise<void>;
  handleMode: () => void;
  loading: boolean;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onHandleClick = () => {
    handleAuth(email, password);
  };

  const renderInputs = () => {
    const buttonName = mode === "login" ? "Sign in" : "Sign up";

    return (
      <div className="flex flex-col w-full gap-4 items-center">
        <label className="w-3/6 text-white text-xl">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-3/6 p-6 mb-3  border rounded-2xl bg-white text-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="w-3/6  text-white text-xl">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-3/6 p-6 mb-3 border rounded-2xl bg-white text-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => onHandleClick()}
          disabled={loading}
          className="w-3/6 bg-blue-600 text-white p-4 rounded hover:bg-blue-700 text-2xl cursor-pointer"
        >
          {buttonName}
        </button>
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div className="flex flex-1 flex-col">
        <div className="items-center flex gap-2 cursor-pointer">
          <img
            className="w-32 h-32"
            src="/imgs/logo.png"
            alt="Companion Logo"
          />

          <div className="text-5xl text-white">Companion</div>
        </div>
        <div className="flex flex-1 flex-col gap-16 justify-center">
          <div className="flex w-full flex-col gap-10 text-white font-medium text-center">
            <div className="text-3xl">
              {mode === "signup"
                ? "Start your journey"
                : "Welcome back to your journey"}
            </div>
            <div className="text-4xl">
              {mode === "signup"
                ? "Sign up to Companion Outreach"
                : "Sign in to Companion Outreach"}
            </div>
          </div>
          {renderInputs()}
          <div>
            <div className="flex flex-1 w-full flex-col gap-10 items-center">
              <div className="flex gap-1 w-3/6 text-2xl text-white font-medium ">
                {mode === "login" ? (
                  <div>Have an account?</div>
                ) : (
                  <div>Take a look at your account?</div>
                )}

                <div
                  className="underline text-blue-300 hover:text-blue-500 cursor-pointer"
                  onClick={() => handleMode()}
                >
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageWrapper isNavbar={false}>
      <div className="flex h-full justify-center">
        {renderLogin()}
        <div className="flex flex-1 flex-col gap-4 bg-green-500"></div>
      </div>
    </PageWrapper>
  );
};

export default LoginView;
