import { createFileRoute } from "@tanstack/react-router";
import EmailCampaignView from "../../../views/EmailCampaignView/EmailCampaignView";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { emailServices } from "../../../services/email.service";

export const Route = createFileRoute("/emailCampaigns/$emailCampaignId/mass")({
  component: MassEmail,
});

export type Email = {
  emailId: string;
  content: string;
  createdAt: string;
};

export default function MassEmail() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState<number>(0);

  const { emailCampaignId } = Route.useParams();

  const { data: emailCampaignData } = useQuery({
    queryKey: ["emailCampaign", emailCampaignId],
    queryFn: () => emailServices.getEmailCampaign(emailCampaignId),
  });

  useEffect(() => {
    if (
      emailCampaignData &&
      emailCampaignData.emails &&
      emailCampaignData.emails?.length > 0
    ) {
      setEmails(emailCampaignData.emails);
    }
  }, [emailCampaignData]);

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

  const resetAll = () => {
    setEmails([]);
    setLike(false);
    setDislike(false);
    setIsCopy(false);
    setIsFollowUp(false);
    setIsRefresh(false);
  };

  return (
    <EmailCampaignView
      like={like}
      dislike={dislike}
      isRefresh={isRefresh}
      isCopy={isCopy}
      isFollowUp={isFollowUp}
      handleLike={handleLike}
      handleDislike={handleDislike}
      handleIsRefresh={handleIsRefresh}
      handleCopy={handleCopy}
      handleFollowUp={handleFollowUp}
      currentEmailIndex={currentEmailIndex}
      emailCampaignData={emailCampaignData}
      emails={emails}
    />
  );
}
