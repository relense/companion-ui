import PageWrapper from "../PageWrapper/PageWrapper";

const HistoryView = ({ signOut }: { signOut: () => void }) => {
  const generatorButtons = () => {
    return (
      <div className="p-4 flex gap-5">
        <button
          onClick={() => signOut()}
          className="text-white bg-blue-500 rounded-lg font-medium p-4 cursor-pointer hover:bg-blue-600"
          type="button"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900">
        {generatorButtons()}
      </div>
    </PageWrapper>
  );
};

export default HistoryView;
