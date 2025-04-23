import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Onboarding from "../components/Onboarding/Onboarding";
import { useAuth } from "../hooks/useAuth";
import LoadingView from "../views/LoadingView/LoadingView";

export const Route = createFileRoute("/")({
  component: App,
});

export default function App() {
  const [appStatus, setAppStatus] = useState<"Loading" | "Onboarding">(
    "Loading"
  );

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "Authenticated") {
      navigate({ to: "/home" });
    } else if (auth.status === "Unauthenticated") {
      setAppStatus("Onboarding");
    }
  }, [auth.status]);

  if (appStatus === "Onboarding") {
    return <Onboarding />;
  } else {
    return <LoadingView />;
  }
}
