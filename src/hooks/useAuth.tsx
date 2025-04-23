import {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
  type ReactNode,
} from "react";

import { supabaseServices } from "../services/supabase.services";
import { useNavigate, useRouter } from "@tanstack/react-router";

export type AuthContextStatus =
  | "Initializing"
  | "Unauthenticated"
  | "Authenticated";

export interface AuthContextType {
  status: AuthContextStatus;
  checkUserSession: () => void;
  signUp: (params: { email: string; password: string }) => void;
  signIn: (params: { email: string; password: string }) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  status: "Initializing",
  checkUserSession: () => {},
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [status, setStatus] = useState<AuthContextStatus>("Initializing");

  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    checkUserSession();
  }, [status]);

  const checkUserSession = async () => {
    try {
      const checkSession = await supabaseServices.checkUserSession();

      if (checkSession.status === "Authenticated") {
        setStatus("Authenticated");
        navigate({ to: "/" });
      } else {
        if (
          router.state.location.pathname !== "/" &&
          router.state.location.pathname !== "/login"
        ) {
          navigate({ to: "/" });
        }

        setStatus("Unauthenticated");
      }
    } catch (error) {
      setStatus("Unauthenticated");
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const session = await supabaseServices.signIn(email, password);

      if (session.status === "Authenticated") {
        setStatus("Authenticated");
      } else {
        setStatus("Unauthenticated");
      }
    } catch (error) {
      setStatus("Unauthenticated");
    }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const session = await supabaseServices.signIn(email, password);

      if (session.status === "Authenticated") {
        setStatus("Authenticated");
      } else {
        setStatus("Unauthenticated");
      }
    } catch (error) {
      setStatus("Unauthenticated");
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("tempNovaToken");
      const data = await supabaseServices.signout();

      setStatus("Unauthenticated");
    } catch (error) {
      localStorage.removeItem("tempNovaToken");
      setStatus("Unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{ status, checkUserSession, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
