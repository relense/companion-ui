import { createFileRoute } from "@tanstack/react-router";
import History from "../components/History/History";

export const Route = createFileRoute("/home")({
  component: Home,
});

export default function Home() {
  return <History />;
}
