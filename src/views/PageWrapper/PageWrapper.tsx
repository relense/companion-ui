import Navbar from "../../components/Navbar/Navbar";

const PageWrapper = ({
  isNavbar = true,
  children,
}: {
  isNavbar?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      {isNavbar && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}
      <div className="flex-1 overflow-auto p-10">{children}</div>
    </div>
  );
};

export default PageWrapper;
