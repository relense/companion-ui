import {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
  type ReactNode,
} from "react";

import {
  supabaseServices,
  type SignInResponse,
} from "../services/supabase.services";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { userServices } from "../services/user.services";

export type AuthContextStatus =
  | "Initializing"
  | "Unauthenticated"
  | "ConfirmEmail"
  | "Authenticated"
  | "InvalidCredentials";

export interface AuthContextType {
  status: AuthContextStatus;
  checkUserSession: () => void;
  signUp: (params: {
    email: string;
    password: string;
  }) => Promise<{ status: "signin" | "confirmEmail" }>;
  signIn: (params: {
    email: string;
    password: string;
  }) => Promise<SignInResponse>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  status: "Initializing",
  checkUserSession: () => {},
  signIn: async () => ({ status: "Unauthenticated" }),
  signUp: async () => ({ status: "signin" }),
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [status, setStatus] = useState<AuthContextStatus>("Initializing");

  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();

  useEffect(() => {
    checkUserSession();
  }, [status]);

  const checkUserSession = async () => {
    try {
      const checkSession = await supabaseServices.checkUserSession();

      if (checkSession.status === "Authenticated") {
        if (checkSession.token) {
          localStorage.setItem("tempNovaToken", checkSession.token);
        }
        setStatus("Authenticated");
        if (!location.pathname.includes("signup-callback")) {
          navigate({ to: "/home" });
        }
      } else {
        if (status === "Initializing") {
          if (
            router.state.location.pathname !== "/" &&
            router.state.location.pathname !== "/login"
          ) {
            navigate({ to: "/" });
          }

          setStatus("Unauthenticated");
        }
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
  }): Promise<SignInResponse> => {
    try {
      const session = await supabaseServices.signIn(email, password);

      if (session.status === "Authenticated") {
        const userMessages = localStorage.getItem("userMessages");

        const response = await userServices.completeAuth(
          {
            messages: userMessages ? JSON.parse(userMessages) : [],
          },
          session.token
        );

        if (response) {
          localStorage.removeItem("userMessages");
        }

        setStatus("Authenticated");
        return session;
      } else if (session.status === "ConfirmEmail") {
        setStatus("ConfirmEmail");
        return session;
      } else if (session.status === "InvalidCredentials") {
        setStatus("InvalidCredentials");
        return session;
      } else {
        setStatus("Unauthenticated");
        return session;
      }
    } catch (error) {
      setStatus("Unauthenticated");
      return { status: "Unauthenticated" };
    }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ status: "signin" | "confirmEmail" }> => {
    try {
      const data = await supabaseServices.signup(email, password);

      if (data.user?.identities?.length === 0) {
        return { status: "signin" };
      }

      return { status: "confirmEmail" };
    } catch (error) {
      throw new Error("Sign up failed");
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("tempNovaToken");
      await supabaseServices.signout();

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
