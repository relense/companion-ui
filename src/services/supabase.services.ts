import { supabase } from "../lib/supabaseClient";

const checkUserSession = async () => {
  const { data } = await supabase.auth.getSession();

  if (data.session?.user.role === "authenticated")
    return {
      status: "Authenticated",
      token: data.session.access_token,
    };
  else
    return {
      status: "Unauthenticated",
    };
};

export type SignInResponse =
  | { status: "Authenticated"; token: string }
  | { status: "ConfirmEmail" }
  | { status: "InvalidCredentials" }
  | { status: "Unauthenticated" };

async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.code === "email_not_confirmed") {
    return {
      status: "ConfirmEmail",
    };
  }

  if (error?.code === "invalid_credentials") {
    return {
      status: "InvalidCredentials",
    };
  }

  if (data.session?.user.role === "authenticated") {
    const token = data?.session?.access_token;

    if (token) {
      localStorage.setItem("tempNovaToken", token);
    }

    return {
      status: "Authenticated",
      token,
    };
  } else {
    return {
      status: "Unauthenticated",
    };
  }
}

async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        userRole: "CLIENT",
      },
      emailRedirectTo: "http://localhost:3000/signup-callback",
    },
  });

  if (error) {
    throw new Error(`${error}`);
  } else {
    const token = data?.session?.access_token;

    if (token) {
      localStorage.setItem("token", token);
    }
  }

  return data;
}

async function signout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`${error}`);
  }
}

const supabaseServices = {
  checkUserSession,
  signIn,
  signup,
  signout,
};

export { supabaseServices };
