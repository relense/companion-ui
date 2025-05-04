import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { userServices } from "../services/user.services";
import { supabaseServices } from "../services/supabase.services";
import LoadingView from "../views/LoadingView/LoadingView";

export const Route = createFileRoute("/signup-callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const hasRun = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkCompleteAuth = async () => {
      const token = (await supabaseServices.checkUserSession()).token || "";
      localStorage.setItem("tempNovaToken", token);
      const userMessages = localStorage.getItem("userMessages");

      const response = await userServices.completeAuth(
        {
          messages: userMessages ? JSON.parse(userMessages) : [],
        },
        token
      );

      if (response) {
        localStorage.removeItem("userMessages");
        navigate({ to: "/home" });
      }
    };

    checkCompleteAuth();
  }, []);

  return <LoadingView />;
}
