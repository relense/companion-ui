import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { emailServices } from "../../../../services/email.service";
import EmailCampaignIndividualOnboardingView from "../../../../views/EmailCampaignIndividualOnboardingView/EmailCampaignIndividualOnboardingView";
import type { Question } from "../../../../utils/prompts";
import { openaiServices } from "../../../../services/openapi.services";
import LoadingView from "../../../../views/LoadingView/LoadingView";
import { profilerService } from "../../../../services/profiler.service";
import EmailCampaignView from "../../../../views/EmailCampaignView/EmailCampaignView";

export const Route = createFileRoute(
  "/emailCampaigns/$emailCampaignId/individual/$profilerId"
)({
  component: ProfilerId,
});

export type Email = {
  emailId: string;
  content: string;
  createdAt: string;
};

function ProfilerId() {
  const [pageStatus, setPageStatus] = useState<
    "Loading" | "OnBoarding" | "Email"
  >("Loading");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [emails, setEmails] = useState<Email[]>([]);
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDislike] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isFollowUp, setIsFollowUp] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState<number>(0);

  const { emailCampaignId, profilerId } = Route.useParams();

  const { data, refetch: fetchEmailCampaign } = useQuery({
    queryKey: ["getEmailCampaign", emailCampaignId],
    queryFn: () => emailServices.getEmailCampaign(emailCampaignId),
    enabled: false,
  });

  const { data: profilerData } = useQuery({
    queryKey: ["getProfiler", profilerId],
    queryFn: () =>
      profilerService.getProfilerByEmailCampaignId(emailCampaignId),
  });

  const { mutate: generateMoreProfiler } = useMutation({
    mutationFn: (params?: { message?: Question }) =>
      openaiServices.generateMoreProfiler({
        message: params?.message,
        profilerId: profilerId,
      }),
    onSuccess: (response) => {
      const newQuestions = [...questions];
      newQuestions.push({
        content: response.message.content,
        role: response.message.role as Question["role"],
      });

      setQuestions(newQuestions);
    },
  });

  useEffect(() => {
    fetchEmailCampaign();
  }, []);

  useEffect(() => {
    if (data) {
      if (data.messages.length === 0) {
        generateMoreProfiler(undefined);
      } else {
        setQuestions(() => {
          return data.messages.map((message) => ({
            role: message.role,
            content: message.content,
          }));
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.emails && data.emails?.length > 0) {
      setEmails(data.emails);
    }
  }, [data]);

  useEffect(() => {
    if (profilerData) {
      if (profilerData.hasOnBoarding) {
        setPageStatus("Email");
        fetchEmailCampaign();
      } else {
        setPageStatus("OnBoarding");
      }
    }
  }, [profilerData]);

  const handleNext = (answer: string) => {
    setLoadingAnswer(true);

    const newAnswer: Question = {
      role: "user",
      content: answer,
    };

    const updatedQuestionsData = [...questions];
    updatedQuestionsData.push({
      content: newAnswer.content,
      role: newAnswer.role,
    });

    generateMoreProfiler({
      message: {
        content: newAnswer.content,
        role: newAnswer.role,
      },
    });

    setQuestions(updatedQuestionsData);
    setLoadingAnswer(false);
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
    if (data && data.emails) {
      try {
        const email = data?.emails.find((email) => email.emailId === emailId);

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

  if (pageStatus === "Loading") {
    return <LoadingView />;
  } else if (pageStatus === "OnBoarding") {
    return (
      <EmailCampaignIndividualOnboardingView
        handleNext={handleNext}
        loadingAnswer={loadingAnswer}
        questions={questions}
      />
    );
  } else {
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
        emailCampaignData={data}
        emails={emails}
      />
    );
  }
}
