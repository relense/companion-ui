import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import EmailOnboardingView from "../../../views/EmailOnboardingView/EmailOnboardingView";
import { emailServices } from "../../../services/email.service";
import { useEffect, useState } from "react";
import LoadingView from "../../../views/LoadingView/LoadingView";

export const Route = createFileRoute("/emailCampaigns/$emailCampaignId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [pageStatus, setPageStatus] = useState<"LOADING" | "IDLE">("LOADING");
  const { emailCampaignId } = Route.useParams();
  const navigate = useNavigate();

  const { mutate: updateEmailCampaign } = useMutation({
    mutationFn: (params: { name: string; isIndividual: boolean }) =>
      emailServices.updateEmailCampaign({
        emailCampaignId: emailCampaignId,
        isIndividual: params.isIndividual,
        name: params.name,
      }),
    onSuccess: () => {
      refetchEmailCampaignData();
    },
  });

  const { data: emailCampaignData, refetch: refetchEmailCampaignData } =
    useQuery({
      queryKey: ["emailCampaign", emailCampaignId],
      queryFn: () => emailServices.getEmailCampaign(emailCampaignId),
      staleTime: 0,
    });

  useEffect(() => {
    if (emailCampaignData) {
      if (
        emailCampaignData.isIndividual === true &&
        emailCampaignData.profilerId
      ) {
        navigate({
          to: "/emailCampaigns/$emailCampaignId/individual/$profilerId",
          params: {
            emailCampaignId: emailCampaignId,
            profilerId: emailCampaignData.profilerId,
          },
        });
      } else if (emailCampaignData.isIndividual === false) {
        navigate({
          to: "/emailCampaigns/$emailCampaignId/mass",
          params: {
            emailCampaignId: emailCampaignId,
          },
        });
      } else {
        setPageStatus("IDLE");
      }
    }
  }, [emailCampaignData, emailCampaignData?.emailCampaignId]);

  const onHandleOnboardingChoice = (choice: "MASS" | "INDIVIDUAL") => {
    updateEmailCampaign({
      isIndividual: choice === "MASS" ? false : true,
      name: emailCampaignData?.name || "",
    });
  };

  if (pageStatus === "IDLE") {
    return (
      <EmailOnboardingView
        onHandleOnboardingChoice={onHandleOnboardingChoice}
      />
    );
  } else {
    return <LoadingView />;
  }
}
