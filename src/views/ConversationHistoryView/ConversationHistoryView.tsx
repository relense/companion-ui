import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useRef, useState } from "react";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import type { Question } from "../../utils/prompts";
import PageWrapper from "../PageWrapper/PageWrapper";

const ConversationHistoryView = ({
  handleNext,
  questions,
  loadingAnswer,
  pageStatus,
  companionHasOnBoarding,
  generateEmail,
}: {
  handleNext: (answer: string) => void;
  questions: Question[];
  loadingAnswer: boolean;
  pageStatus: "Loading" | "Idle";
  companionHasOnBoarding: boolean;
  generateEmail: () => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  const botMessagebuble = (message: string) => {
    return (
      <div className="flex text-start p-4 text-white text-lg font-semibold whitespace-pre-line">
        {message}
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

  const renderConversation = () => {
    return (
      <div
        ref={scrollContainerRef}
        className="w-full p-6 text-center overflow-auto scrollbar-none items-center flex flex-col "
      >
        <div className="max-w-6xl w-full">
          <div className="flex flex-col flex-1">
            {questions &&
              questions.map((question, index) => {
                if (index < questions.length) {
                  return (
                    <Fragment key={`${question.content}`}>
                      {question.role === "assistant" &&
                        botMessagebuble(question.content)}
                      {question.role === "user" &&
                        userMessageBuble(question.content)}
                    </Fragment>
                  );
                }
              })}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    );
  };

  const renderInput = () => {
    return (
      <div className="flex justify-center flex-col max-w-6xl w-full">
        {loadingAnswer && <div className="text-white">spinner</div>}
        <div className="flex flex-col p-3 text-sm rounded-xl bg-gray-500">
          <textarea
            disabled={loadingAnswer}
            ref={inputRef}
            placeholder="Message Outreach Companion"
            className="w-full placeholder:text-gray-405 text-white outline-none resize-none max-h-50"
            value={answer}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onChange={(e) => {
              e.preventDefault();
              setAnswer(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.style.height = "auto";
                handleNext(e.currentTarget.value);
                setAnswer("");
              }
            }}
          />
          <div className="flex mt-4 w-full">
            {companionHasOnBoarding && pageStatus === "Idle" && (
              <div className="flex flex-1 w-full gap-4">
                <button
                  className="text-white bg-blue-500 rounded-lg font-medium p-2 cursor-pointer hover:bg-blue-600"
                  onClick={() => generateEmail()}
                >
                  Generate Email
                </button>
              </div>
            )}

            <div className="flex items-end">
              <div
                className="flex items-center justify-center rounded-full w-7 h-7 bg-white text-black hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.style.height = "auto";
                  }
                  handleNext(answer);
                }}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900">
        {renderConversation()}
        {renderInput()}
      </div>
    </PageWrapper>
  );
};

export default ConversationHistoryView;
