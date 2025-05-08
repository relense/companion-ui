import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import PageWrapper from "../../views/PageWrapper/PageWrapper";
import { emailServices } from "../../services/email.service";

export const Route = createFileRoute("/emailCampaigns/$campaignId")({
  component: RouteComponent,
});

function RouteComponent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { campaignId } = Route.useParams();

  const { data: emailCampaignData } = useQuery({
    queryKey: ["emailCampaign", campaignId],
    queryFn: () => emailServices.getEmailCampaign(campaignId),
  });

  useEffect(() => {
    if (emailCampaignData) {
      console.log("ESTOU Numa campanha: ", emailCampaignData);
    }
  }, [emailCampaignData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const renderEmail = (message: string) => {
    return (
      <div className="flex text-start p-4 text-white text-lg font-semibold whitespace-pre-line">
        {message}
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
          {/* <div className="flex flex-col flex-1">
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
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center h-[95%] items-center text-gray-900">
        {renderConversation()}
      </div>
    </PageWrapper>
  );
}
