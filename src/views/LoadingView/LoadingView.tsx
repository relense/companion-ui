import Spinner from "../../components/Spinner/Spinner";
import PageWrapper from "../PageWrapper/PageWrapper";

const LoadingView = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900">
        <Spinner />
      </div>
    </PageWrapper>
  );
};

export default LoadingView;
