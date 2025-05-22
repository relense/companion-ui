import { Link } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [authStatus, setAuthStatus] = useState<
    "Authenticated" | "Unautehtenticated" | "Loading"
  >("Loading");
  const [pressedHamburguer, setPressedHamburguer] = useState<boolean>(false);
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
        <div className="flex flex-col">
          <FontAwesomeIcon
            className={`cursor-pointer hover:text-gray-400 ${pressedHamburguer ? "text-gray-400" : ""}`}
            icon={faBars}
            size="xl"
            onClick={() => setPressedHamburguer((prev) => !prev)}
          />
          {pressedHamburguer && (
            <div className="absolute flex w-96 h-auto bg-gray-600 top-20 right-0 z-20 rounded-lg mr-10">
              {auth.status === "Authenticated" && (
                <button
                  onClick={() => auth.signOut()}
                  className="flex cursor-pointer justify-start items-center flex-1 p-4 hover:bg-gray-600"
                >
                  <div className="flex gap-4 items-center">
                    <FontAwesomeIcon icon={faSignOut} size="lg" />
                    <div>Sign out</div>
                  </div>
                </button>
              )}
            </div>
          )}
          {pressedHamburguer && (
            <div
              className="absolute z-10 h-screen w-screen  top-0 left-0"
              onClick={() => setPressedHamburguer((prev) => !prev)}
            />
          )}
        </div>
      </div>
    );
  } else if (authStatus === "Unautehtenticated") {
    return (
      <div className="flex w-full h-15 p-10 items-center text-white">
        {renderLogo()}
        {auth.status === "Unauthenticated" && (
          <Link
            to="/login"
            className="flex w-full justify-end cursor-pointer gap-4 items-center hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faSignIn} size="lg" />
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
