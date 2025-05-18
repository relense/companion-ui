import PageWrapper from "../PageWrapper/PageWrapper";

const EmailOnboardingView = ({
  onHandleOnboardingChoice,
}: {
  onHandleOnboardingChoice: (choice: "MASS" | "INDIVIDUAL") => void;
}) => {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-full items-center text-gray-900 cursor-default p-16">
        <div className="flex flex-1 w-full gap-16">
          <div
            className="flex flex-1 flex-col bg-neutral-600 justify-center items-center text-white text-center text-4xl cursor-pointer hover:bg-gray-700 rounded-2xl"
            onClick={() => onHandleOnboardingChoice("MASS")}
          >
            <img
              className="w-120 h-120"
              src="/imgs/massEmail.png"
              alt="Mass Email Logo"
            />
            <div>Mass Email</div>
          </div>
          <div
            className="flex flex-1 flex-col bg-neutral-600 justify-center items-center text-white text-center text-4xl cursor-pointer hover:bg-gray-700 rounded-2xl"
            onClick={() => onHandleOnboardingChoice("INDIVIDUAL")}
          >
            <img
              className="w-120 h-120"
              src="/imgs/onePerson.png"
              alt="One Person Email Logo"
            />
            <div>1 Person Email</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EmailOnboardingView;
