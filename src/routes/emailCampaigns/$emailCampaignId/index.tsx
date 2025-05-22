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
  const [pageStatus, setPageStatus] = useState<
    "Loading" | "Idle" | "LoadingEmail"
  >("Loading");
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
        setPageStatus("Idle");
      }
    }
  }, [emailCampaignData, emailCampaignData?.emailCampaignId]);

  const onHandleOnboardingChoice = (choice: "MASS" | "INDIVIDUAL") => {
    updateEmailCampaign({
      isIndividual: choice === "MASS" ? false : true,
      name: emailCampaignData?.name || "",
    });

    setPageStatus("LoadingEmail");
  };

  if (pageStatus === "Idle") {
    return (
      <EmailOnboardingView
        onHandleOnboardingChoice={onHandleOnboardingChoice}
      />
    );
  } else if (pageStatus === "Loading") {
    return <LoadingView />;
  } else if (pageStatus === "LoadingEmail") {
    return <LoadingView message={"We are crafting your email"} />;
  }
}
