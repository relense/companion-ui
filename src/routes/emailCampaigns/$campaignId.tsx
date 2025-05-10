import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import PageWrapper from "../../views/PageWrapper/PageWrapper";
import { emailServices } from "../../services/email.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCopy,
  faEdit,
  faPeopleArrows,
  faRefresh,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import type { Question } from "../../utils/prompts";

export const Route = createFileRoute("/emailCampaigns/$campaignId")({
  component: RouteComponent,
});

type Emails = {
  emailId: string;
  content: string;
  createdAt: string;
};

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

function RouteComponent() {
  const [pageStatus, setPageStatus] = useState<
    "Loading" | "Onboarding" | "Writing"
  >("Loading");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { campaignId } = Route.useParams();
  const [emails, setEmails] = useState<Emails[]>([]);
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: emailCampaignData, refetch: refetchEmailCampaignData } =
    useQuery({
      queryKey: ["emailCampaign", campaignId],
      queryFn: () => emailServices.getEmailCampaign(campaignId),
    });

  const { mutate: updateEmailCampaign } = useMutation({
    mutationFn: (params: { name: string; isIndividual: boolean }) =>
      emailServices.updateEmailCampaign({
        emailCampaignId: campaignId,
        isIndividual: params.isIndividual,
        name: params.name,
      }),
    onSuccess: () => {
      refetchEmailCampaignData();
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  useEffect(() => {
    if (emailCampaignData) {
      if (
        emailCampaignData.isIndividual !== null &&
        emailCampaignData.isIndividual !== undefined
      ) {
        setPageStatus("Writing");
        resetAll();
      } else {
        setPageStatus("Onboarding");
      }

      if (emailCampaignData.emails && emailCampaignData.emails?.length > 0) {
        setEmails(emailCampaignData.emails);
      }
    }
  }, [emailCampaignData]);

  const resetAll = () => {
    setEmails([]);
    setLike(false);
    setDislike(false);
    setIsEdit(false);
    setIsCopy(false);
    setQuestions(questionsData);
    setLoadingAnswer(false);
    setAnswer("");
    setIsFollowUp(false);
    setIsRefresh(false);
  };

  const onHandleOnboardingChoice = (choice: "MASS" | "INDIVIDUAL") => {
    updateEmailCampaign({
      isIndividual: choice === "MASS" ? false : true,
      name: emailCampaignData?.name || "",
    });
    setPageStatus("Writing");
  };

  const renderEmailOnboarding = () => {
    return (
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
    );
  };

  const handleLike = () => {
    if (!like) {
      setDislike(false);
    }
    setLike((prev) => !prev);
    //missing update in database
  };

  const handleDislike = () => {
    if (!dislike) {
      setLike(false);
    }
    setDislike((prev) => !prev);
    //missing update in database
  };

  const handleIsRefresh = () => {
    setIsRefresh((prev) => !prev);
  };

  const handleEdit = () => {
    setIsEdit((prev) => {
      if (!prev) {
        setQuestions([
          { content: "What is it you want to edit?", role: "assistant" },
        ]);
      } else {
        setQuestions([]);
      }

      return !prev;
    });
    //add call backend to fetch an answer from the bot, or just show a generic like. What do you want to update?
    //when we have the answer that can be send to the bot, both the question and the answer
    //edit will enable input and show arrow button
  };

  const handleCopy = async (emailId: string) => {
    if (emailCampaignData && emailCampaignData.emails) {
      try {
        const email = emailCampaignData?.emails.find(
          (email) => email.emailId === emailId
        );

        if (!email) {
          console.warn("Email not found");
          return;
        }

        await navigator.clipboard.writeText(email.content);
        setIsCopy((prev) => !prev);
        //ADD A CALL TO A TOAST
      } catch (err) {
        //ADD A CALL TO A TOAST
      }
    }
  };

  const handleFollowUp = () => {
    setIsFollowUp((prev) => !prev);
  };

  const renderEmail = (emailId: string, email: string) => {
    return (
      <div className="flex flex-col text-start p-4 text-white text-lg font-semibold whitespace-pre-line gap-4">
        {email}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full h-1 bg-gray-300 border-r-4" />
          <div className="flex gap-6 items-center">
            <FontAwesomeIcon
              title="Like Email"
              className={`cursor-pointer hover:text-blue-300 ${like ? "text-blue-300" : ""}`}
              icon={faThumbsUp}
              onClick={() => handleLike()}
            />
            <FontAwesomeIcon
              title="Disike Email"
              className={`cursor-pointer hover:text-blue-300 ${dislike ? "text-blue-300" : ""}`}
              icon={faThumbsDown}
              onClick={() => handleDislike()}
            />

            <FontAwesomeIcon
              title="Create New Email"
              className={`cursor-pointer hover:text-blue-300 ${isRefresh ? "text-blue-300" : ""}`}
              icon={faRefresh}
              onClick={() => handleIsRefresh()}
            />
            <FontAwesomeIcon
              title="Edit Email"
              className={`cursor-pointer hover:text-blue-300 ${isEdit ? "text-blue-300" : ""}`}
              icon={faEdit}
              onClick={() => handleEdit()}
            />
            <FontAwesomeIcon
              title="Copy Email"
              className={`cursor-pointer hover:text-blue-300 ${isCopy ? "text-blue-300" : ""}`}
              icon={faCopy}
              onClick={() => handleCopy(emailId)}
            />
            <FontAwesomeIcon
              title="Follow Up Email"
              className={`cursor-pointer hover:text-blue-300 ${isFollowUp ? "text-blue-300" : ""}`}
              icon={faPeopleArrows}
              onClick={() => handleFollowUp()}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderInput = () => {
    return (
      <div className="flex justify-center flex-1 max-w-6xl w-full">
        <div className="flex flex-col w-full p-3 text-sm rounded-xl bg-gray-500">
          <textarea
            ref={inputRef}
            disabled={!isEdit || loadingAnswer}
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
          {isEdit && (
            <div className="flex justify-end items-end mt-4">
              <div
                className="flex items-center justify-center rounded-full w-7 h-7 bg-white text-black hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.style.height = "auto";
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            {emails &&
              emails.map((item, index) => {
                if (index < emails.length) {
                  return (
                    <Fragment key={`${item.emailId}`}>
                      {renderEmail(item.emailId, item.content)}
                    </Fragment>
                  );
                }
              })}
          </div>
        </div>
        <div className="max-w-6xl w-full">
          <div className="flex flex-col flex-1 gap-4">
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
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    );
  };

  const handleNext = (answer: string) => {
    setLoadingAnswer(true);

    const updatedQuestionsData = [...questions];
    updatedQuestionsData.push({
      role: "user",
      content: answer,
    });

    setQuestions(updatedQuestionsData);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-full items-center text-gray-900">
        {pageStatus === "Onboarding" && renderEmailOnboarding()}
        {pageStatus === "Writing" && (
          <>
            {renderConversation()}
            <div className="flex flex-1 w-full justify-center items-end">
              {renderInput()}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
