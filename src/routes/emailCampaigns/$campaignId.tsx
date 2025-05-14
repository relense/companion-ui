import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import PageWrapper from "../../views/PageWrapper/PageWrapper";
import { emailServices } from "../../services/email.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarChart,
  faCalendar,
  faCircle,
  faCopy,
  faEdit,
  faEnvelope,
  faNoteSticky,
  faPeopleArrows,
  faRefresh,
  faSmile,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import type { Question } from "../../utils/prompts";

export const Route = createFileRoute("/emailCampaigns/$campaignId")({
  component: RouteComponent,
});

type Email = {
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
  const [emails, setEmails] = useState<Email[]>([]);
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState<number>(0);

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
        <h1 className="flex items-center gap-4 text-4xl font-semibold pb-4">
          <FontAwesomeIcon
            title="Email title"
            icon={faEnvelope}
            onClick={() => handleLike()}
          />{" "}
          First Email |
          {emailCampaignData?.isIndividual ? "Individual" : " Mass"}
        </h1>
        <div className="w-full h-1 bg-gray-300 border-r-4" />
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

  const renderEmailStatus = () => {
    return (
      <div className="flex w-full flex-col text-start p-4 text-white text-lg font-semibold whitespace-pre-line gap-4 ">
        <div className="text-4xl font-semibold pb-4">
          <FontAwesomeIcon
            title="Email Status"
            icon={faBarChart}
            onClick={() => handleLike()}
          />{" "}
          Status
        </div>
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Replied Status"
              icon={faCircle}
              onClick={() => handleLike()}
            />{" "}
            {emailCampaignData?.isIndividual ? "Replied:" : "Replies:"}
          </div>
          <div>
            {emailCampaignData?.isIndividual ? "Yes" : `${"23"} Replies`}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Sentiment Status"
              icon={faSmile}
              onClick={() => handleLike()}
            />{" "}
            Sentiment:
          </div>
          <div>Positive</div>
        </div>
        {emailCampaignData && emailCampaignData.isIndividual && (
          <div className="flex flex-row gap-2">
            <div className="font-semibold min-w-fit">
              <FontAwesomeIcon
                title="Email Replied Date"
                icon={faCalendar}
                onClick={() => handleLike()}
              />{" "}
              Replied on:
            </div>
            <div>May 13, 2025</div>
          </div>
        )}
        {emailCampaignData && !emailCampaignData.isIndividual && (
          <>
            <div className="flex flex-row gap-2">
              <div className="font-semibold min-w-fit">
                <FontAwesomeIcon
                  title="Email First Replied Date"
                  icon={faCalendar}
                  onClick={() => handleLike()}
                />{" "}
                First Reply
              </div>
              <div>May 13, 2025</div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="font-semibold min-w-fit">
                <FontAwesomeIcon
                  title="Email Last Replied Date"
                  icon={faCalendar}
                  onClick={() => handleLike()}
                />{" "}
                Last Reply
              </div>
              <div>May 13, 2025</div>
            </div>
          </>
        )}
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Notes"
              icon={faNoteSticky}
              onClick={() => handleLike()}
            />{" "}
            Notes:
          </div>
          <div>Mentioned interest in a demo next week.</div>
        </div>
      </div>
    );
  };

  const renderEmailOverview = () => {
    return (
      <div
        ref={scrollContainerRef}
        className="max-w-6xl w-full flex flex-1 overflow-auto scrollbar-none"
      >
        {currentEmailIndex !== -1 && (
          <div className="flex flex-row">
            {renderEmail(
              emails[currentEmailIndex].emailId,
              emails[currentEmailIndex].content
            )}
            {renderEmailStatus()}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-full items-center text-gray-900">
        {pageStatus === "Onboarding" && renderEmailOnboarding()}
        {pageStatus === "Writing" && <>{renderEmailOverview()}</>}
      </div>
    </PageWrapper>
  );
}
