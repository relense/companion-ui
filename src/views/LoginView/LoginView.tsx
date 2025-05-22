import { useState } from "react";
import PageWrapper from "../PageWrapper/PageWrapper";
import type { LoginPageStatus } from "../../routes/login";

const LoginView = ({
  mode,
  handleAuth,
  handleMode,
  pageStatus,
}: {
  mode: "login" | "signup";
  handleAuth: (email: string, password: string) => Promise<void>;
  handleMode: () => void;
  pageStatus: LoginPageStatus;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onHandleClick = () => {
    handleAuth(email, password);
  };

  const renderInputs = () => {
    const buttonName = mode === "login" ? "Sign in" : "Sign up";
    const disabled =
      (pageStatus === "LoadingSignIn" ||
        pageStatus === "ConfirmEmail" ||
        pageStatus === "SignIn") &&
      mode === "signup";

    return (
      <div className="flex flex-col flex-1 w-full gap-4 items-center justify-center">
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

        {pageStatus === "ConfirmEmail" && mode === "signup" && (
          <div className="text-red-600 font-bold text-2xl">
            Please confirm your email and sign in
          </div>
        )}

        {pageStatus === "SignIn" && mode === "signup" && (
          <div className="text-red-600 font-bold text-2xl">
            Please sign in instead
          </div>
        )}

        {pageStatus === "ConfirmEmail" && mode === "login" && (
          <div className="text-red-600 font-bold text-2xl">
            Please confirm your email to sign in
          </div>
        )}

        {pageStatus === "InvalidCredentials" && mode === "login" && (
          <div className="text-red-600 font-bold text-2xl">
            Your email or password is wrong. Try again or create an account.
          </div>
        )}

        <button
          onClick={() => onHandleClick()}
          disabled={disabled}
          className={
            disabled
              ? "w-3/6 bg-gray-600 text-white p-4 rounded text-2xl cursor-not-allowed"
              : "w-3/6 bg-blue-600 text-white p-4 rounded hover:bg-blue-700 text-2xl cursor-pointer"
          }
        >
          {pageStatus === "LoadingSignIn" ? "Loading" : buttonName}
        </button>
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div className="flex flex-1 flex-col p-4 pb-10 pt-4">
        <div className="items-center flex gap-2 cursor-pointer">
          <img
            className="w-32 h-32"
            src="/imgs/logo.png"
            alt="Companion Logo"
          />
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
          <div className="flex justify-start">
            <div className="flex flex-1 w-full flex-col">
              <div className="flex gap-1 w-3/6 text-2xl text-white font-medium pl-2 ">
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
    <div className="flex flex-row h-screen bg-neutral-800 overflow-hidden">
      <div className="flex flex-col w-full">
        <div className="flex-1 overflow-auto">
          <div className="flex h-full justify-center">
            {renderLogin()}
            <div
              className="w-1/2 bg-center bg-contain"
              style={{
                backgroundImage: "url('/imgs/background.png')",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
