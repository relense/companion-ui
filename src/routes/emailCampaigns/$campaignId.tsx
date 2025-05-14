import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { emailServices } from "../../services/email.service";
import EmailCampaignView from "../../views/EmailCampaignView/EmailCampaignView";
import EmailCampaignIndividualOnboardingView from "../../views/EmailCampaignIndividualOnboardingView/EmailCampaignIndividualOnboardingView";

export const Route = createFileRoute("/emailCampaigns/$campaignId")({
  component: RouteComponent,
});

export type Email = {
  emailId: string;
  content: string;
  createdAt: string;
};

export type EmailCampaignPageStatus = "Loading" | "Onboarding" | "Writing";

function RouteComponent() {
  const [pageStatus, setPageStatus] =
    useState<EmailCampaignPageStatus>("Loading");
  const { campaignId } = Route.useParams();
  const [emails, setEmails] = useState<Email[]>([]);
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
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
    setIsCopy(false);
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

  if (
    emailCampaignData?.isIndividual === false ||
    emailCampaignData?.isIndividual === null
  ) {
    return (
      <EmailCampaignView
        pageStatus={pageStatus}
        onHandleOnboardingChoice={onHandleOnboardingChoice}
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
  } else {
    return <EmailCampaignIndividualOnboardingView />;
  }
}
