import { createFileRoute } from "@tanstack/react-router";
import PageWrapper from "../views/PageWrapper/PageWrapper";

export const Route = createFileRoute("/home")({
  component: Home,
});

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900"></div>
    </PageWrapper>
  );
}
