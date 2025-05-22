import Spinner from "../../components/Spinner/Spinner";
import PageWrapper from "../PageWrapper/PageWrapper";

const LoadingView = ({ message }: { message?: string }) => {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900 gap-12">
        {message && (
          <div className="text-white text-2xl font-semibold">{message}</div>
        )}
        <Spinner />
      </div>
    </PageWrapper>
  );
};

export default LoadingView;
