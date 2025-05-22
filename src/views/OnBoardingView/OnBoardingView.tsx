import { useRef, useEffect, useState, Fragment } from "react";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PageWrapper from "../PageWrapper/PageWrapper";
import type { Question } from "../../utils/prompts";
import { Link } from "@tanstack/react-router";
import Spinner from "../../components/Spinner/Spinner";

const OnBoardingView = ({
  questions,
  handleNext,
  showGeneratorButtons,
  loadingAnswer,
}: {
  questions: Question[];
  handleNext: (answer: string) => void;
  showGeneratorButtons: boolean;
  loadingAnswer: boolean;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  const botMessagebuble = (message: string) => {
    let newMessage = message;

    if (message.includes("<ONBOARDING_COMPLETE>")) {
      newMessage = message.replace("<ONBOARDING_COMPLETE>", "").trim();
    }

    return (
      <div className="flex text-start p-4 text-white text-lg font-semibold whitespace-pre-line">
        {newMessage}
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
    if (!showGeneratorButtons) {
      return (
        <h1 className="text-2xl font-semibold mb-6 text-white">
          Let’s tailor your outreach style — starting with you.
          <br />
        </h1>
      );
    } else {
      return (
        <h1 className="text-2xl font-semibold mb-6 text-white">
          We have all the information we need for your first cold outreact.
          <br />
        </h1>
      );
    }
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
        {loadingAnswer && <Spinner />}
        <div className="p-3 text-sm rounded-xl bg-gray-500">
          <textarea
            disabled={loadingAnswer || showGeneratorButtons}
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
          <div className="flex justify-end">
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
    );
  };

  const generatorButtons = () => {
    return (
      <div className="p-4 flex gap-5">
        <Link
          to={"/login"}
          className="text-white bg-blue-500 rounded-lg font-medium p-4 cursor-pointer hover:bg-blue-600"
          type="button"
        >
          Sign up to generate your first email
        </Link>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900">
        {renderTitle()}
        {renderConversation()}
        {!showGeneratorButtons && renderInput()}
        {showGeneratorButtons && generatorButtons()}
      </div>
    </PageWrapper>
  );
};

export default OnBoardingView;
