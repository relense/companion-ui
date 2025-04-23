import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";

const PageWrapper = ({
  isNavbar = true,
  children,
}: {
  isNavbar?: boolean;
  children?: React.ReactNode;
}) => {
  const auth = useAuth();

  if (auth.status === "Initializing") {
    return (
      <div className="flex flex-row h-screen bg-neutral-800 overflow-hidden">
        <div className="flex-1 overflow-auto p-10"></div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row h-screen bg-neutral-800 overflow-hidden">
        {auth.status === "Authenticated" && <Sidebar />}
        <div className="flex flex-col w-full">
          {isNavbar && (
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
          )}
          <div className="flex-1 overflow-auto p-10">{children}</div>
        </div>
      </div>
    );
  }
};

export default PageWrapper;
