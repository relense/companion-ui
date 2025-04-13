import { useRef, useEffect } from "react";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Question } from "../../routes";
import Navbar from "../../components/Navbar/Navbar";

const OnBoardingView = ({
  step,
  questions,
  updateAnswer,
  handleNext,
}: {
  step: number;
  questions: Question[];
  updateAnswer: (answer: string) => void;
  handleNext: (answer: string) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  const botMessagebuble = (message: string) => {
    return (
      <div className="flex justify-start p-12 text-white">
        <div className="p-4 w-fit max-w-[66%] rounded-xl text-justify bg-gray-500 text-white break-words whitespace-pre-wrap">
          {message}
        </div>
      </div>
    );
  };

  const userMessageBuble = (message: string) => {
    return (
      <div className="flex justify-end">
        <div className="p-4 w-fit max-w-[66%] rounded-xl text-justify bg-gray-500 text-white break-words whitespace-pre-wrap">
          {message}
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <h1 className="flex justify-center items-center text-2xl font-semibold mb-6 text-white">
        Welcome to <span className="font-bold"> Outreach Companion</span>, let's
        make cold outreach.
      </h1>
    );
  };

  const renderConversation = () => {
    return (
      <>
        {step > 0 && (
          <div className="flex flex-col flex-1">
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
            <div ref={bottomRef} />
          </div>
        )}
      </>
    );
  };

  const renderInput = () => {
    return (
      <div className="flex justify-center flex-col max-w-6xl w-full">
        <p className="text-white p-4">{questions[step].question}</p>
        <div className="p-3 text-sm rounded-xl bg-gray-500">
          <textarea
            ref={inputRef}
            placeholder="Message Cold Outreach Companion"
            className="w-full placeholder:text-gray-405 text-white outline-none resize-none max-h-50"
            value={questions[step].answer}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onChange={(e) => {
              updateAnswer(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.style.height = "auto";
                handleNext(e.currentTarget.value);
              }
            }}
          />
          <div className="flex justify-end">
            <div
              className="flex items-center justify-center rounded-full w-7 h-7 bg-white text-black hover:bg-gray-700 hover:text-white cursor-pointer"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.style.height = "auto";
                }
                handleNext(questions[step].answer);
              }}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen text-gray-900 bg-neutral-800 p-6">
        {renderTitle()}
        <div
          ref={scrollContainerRef}
          className="w-full p-6 text-center overflow-auto scrollbar-none items-center flex flex-col"
        >
          <div className="max-w-6xl w-full">{renderConversation()}</div>
        </div>
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
    </>
  );
};

export default OnBoardingView;
