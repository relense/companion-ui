import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider } from "../hooks/useAuth";
import { GlobalProvider } from "../hooks/useGlobal";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <GlobalProvider>
          <Outlet />
          <TanStackRouterDevtools />
        </GlobalProvider>
      </AuthProvider>
    </>
  ),
});
