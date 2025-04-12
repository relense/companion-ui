import type { Question } from "../../routes";

const OnBoardingView = ({
  step,
  questions,
  updateAnswer,
  handleNext,
  handlePrevious,
}: {
  step: number;
  questions: Question[];
  updateAnswer: (answer: string) => void;
  handleNext: (answer: string) => void;
  handlePrevious: (questionId: number, answer: string) => void;
}) => {
  const botMessagebuble = (message: string) => {
    return (
      <div className="flex justify-start p-12 text-white">
        <div className="p-4 text-justify text-white">{message}</div>
      </div>
    );
  };
  const userMessageBuble = (message: string) => {
    return (
      <div className="flex justify-end">
        <div className="p-4 max-w-2/3 rounded-xl text-justify bg-gray-500 text-white">
          {message}
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Welcome to <span className="font-bold">Outreach Companion</span>, let's
        make cold outreach. {step === 0 ? "Tell me your name." : ""}
      </h1>
    );
  };

  const renderConversation = () => {
    return (
      <>
        {step > 0 && (
          <div className="flex flex-col justify-items-end justify-end ">
            {questions &&
              questions.map((question, index) => {
                if (index < step) {
                  return (
                    <>
                      {botMessagebuble(question.question)}
                      {userMessageBuble(question.answer)}
                    </>
                  );
                }
              })}
          </div>
        )}
      </>
    );
  };

  const renderInput = () => {
    return (
      <div>
        <p className="text-white p-4">{questions[step].question}</p>
        <input
          type="text"
          placeholder={questions[step].question}
          className="w-full p-3 rounded-xl mb-4 bg-gray-500 placeholder:text-gray-405"
          value={questions[step].answer}
          onChange={(e) => {
            updateAnswer(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNext(e.currentTarget.value);
          }}
        />
        <p className="text-sm text-gray-500">Press Enter to continue</p>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg- text-gray-900 bg-influencer">
      <div className="max-w-6xl w-full p-6 text-center">
        {renderTitle()}
        {renderConversation()}
        {step < questions.length ? (
          renderInput()
        ) : (
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            // onClick={handleGenerate}
          >
            Generate First Email
          </button>
        )}
      </div>
    </div>
  );
};

export default OnBoardingView;
