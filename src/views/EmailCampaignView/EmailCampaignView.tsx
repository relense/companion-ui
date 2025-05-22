import PageWrapper from "../../views/PageWrapper/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarChart,
  faCalendar,
  faCircle,
  faCopy,
  faEnvelope,
  faEnvelopesBulk,
  faNoteSticky,
  faPeopleArrows,
  faRefresh,
  faSmile,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import type { emailServices } from "../../services/email.service";
import type { Email } from "../../routes/emailCampaigns/$emailCampaignId/mass";

const EmailCampaignView = ({
  like,
  dislike,
  isRefresh,
  isCopy,
  isFollowUp,
  handleLike,
  handleDislike,
  handleIsRefresh,
  handleCopy,
  handleFollowUp,
  currentEmailIndex,
  emailCampaignData,
  emails,
}: {
  like: boolean;
  dislike: boolean;
  isRefresh: boolean;
  isCopy: boolean;
  isFollowUp: boolean;
  handleLike: () => void;
  handleDislike: () => void;
  handleIsRefresh: () => void;
  handleCopy: (emailId: string) => void;
  handleFollowUp: () => void;
  currentEmailIndex: number;
  emailCampaignData: Awaited<ReturnType<typeof emailServices.getEmailCampaign>>;
  emails: Email[];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const renderEmail = (emailId: string, email: string) => {
    return (
      <div className="flex flex-col w-full text-start p-4 text-white text-lg font-semibold whitespace-pre-line gap-4">
        <h1 className="flex items-center gap-4 text-4xl font-semibold pb-4">
          <FontAwesomeIcon
            title="Email title"
            icon={
              emailCampaignData?.isIndividual ? faEnvelope : faEnvelopesBulk
            }
            onClick={() => handleLike()}
          />{" "}
          First Email |{" "}
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
      <div className="flex flex-col text-start p-4 text-white text-lg font-semibold whitespace-pre-line gap-4 ">
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
              title="Email Sentiment Status"
              icon={faEnvelope}
              onClick={() => handleLike()}
            />{" "}
            Email Status:
          </div>
          <div className="cursor-pointer">Unsent</div>
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
          <div className="cursor-pointer">
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
          <div className="cursor-pointer">Positive</div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email First Replied Date"
              icon={faCalendar}
              onClick={() => handleLike()}
            />{" "}
            First Reply:
          </div>
          <div className="cursor-pointer">May 13, 2025</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Last Replied Date"
              icon={faCalendar}
              onClick={() => handleLike()}
            />{" "}
            Last Reply:
          </div>
          <div className="cursor-pointer">May 13, 2025</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Last Replied Date"
              icon={faCalendar}
              onClick={() => handleLike()}
            />{" "}
            Call Scheduled:
          </div>
          <div className="cursor-pointer">May 13, 2025</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="font-semibold min-w-fit">
            <FontAwesomeIcon
              title="Email Notes"
              icon={faNoteSticky}
              onClick={() => handleLike()}
            />{" "}
            Notes:
          </div>
          <div className="cursor-pointer">
            Mentioned interest in a demo next week.
          </div>
        </div>
      </div>
    );
  };

  const renderEmailOverview = () => {
    return (
      <div className="flex flex-col justify-center h-full w-full items-center text-gray-900 cursor-default">
        <div
          ref={scrollContainerRef}
          className="max-w-7/12 2xl:max-w-11/12 w-full flex flex-1 overflow-auto scrollbar-none justify-center"
        >
          {currentEmailIndex !== -1 && emails[currentEmailIndex] && (
            <div className="flex flex-row gap-16">
              {renderEmail(
                emails[currentEmailIndex].emailId,
                emails[currentEmailIndex].content
              )}
              {renderEmailStatus()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return <PageWrapper>{renderEmailOverview()}</PageWrapper>;
};

export default EmailCampaignView;
