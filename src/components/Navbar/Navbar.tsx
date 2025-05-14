import { Link } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [authStatus, setAuthStatus] = useState<
    "Authenticated" | "Unautehtenticated" | "Loading"
  >("Loading");
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "Authenticated") {
      setAuthStatus("Authenticated");
    } else if (auth.status === "Unauthenticated") {
      setAuthStatus("Unautehtenticated");
    } else {
      setAuthStatus("Loading");
    }
  }, [auth.status]);

  const renderLogo = () => {
    return (
      <Link to={"/home"} className="flex cursor-pointer gap-2 items-center">
        <img className="w-12 h-12" src="/imgs/logo.png" alt="Companion Logo" />
        {authStatus !== "Authenticated" && <div>Outreach Companion</div>}
      </Link>
    );
  };

  if (authStatus === "Authenticated") {
    return (
      <div className="flex w-full h-15 p-10 items-center text-white justify-between">
        {renderLogo()}
        {auth.status === "Authenticated" && (
          <button
            onClick={() => auth.signOut()}
            className="flex cursor-pointer"
          >
            <div>Sign out</div>
          </button>
        )}
      </div>
    );
  } else if (authStatus === "Unautehtenticated") {
    return (
      <div className="flex w-full h-15 p-10 items-center text-white">
        {renderLogo()}
        {auth.status === "Unauthenticated" && (
          <Link to="/login" className="flex w-full justify-end cursor-pointer">
            <div>Sign in</div>
          </Link>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex w-full h-15 p-10 items-center text-white">
        {renderLogo()}
      </div>
    );
  }
};

export default Navbar;
