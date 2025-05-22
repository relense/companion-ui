import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Question } from "../utils/prompts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { openaiServices } from "../services/openapi.services";
import { companionServices } from "../services/companion.services";
import ConversationHistoryView from "../views/ConversationHistoryView/ConversationHistoryView";
import { useAuth } from "../hooks/useAuth";
import { emailServices } from "../services/email.service";
import { useGlobal } from "../hooks/useGlobal";
import LoadingView from "../views/LoadingView/LoadingView";

export const Route = createFileRoute("/home")({
  component: Home,
});

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function Home() {
  const [pageStatus, setPageStatus] = useState<"Loading" | "Idle">("Loading");
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const global = useGlobal();

  const [companionHasOnBoarding, setCompanionHasOnBoarding] =
    useState<boolean>(false);

  if (auth.status !== "Authenticated") {
    navigate({ to: "/" });
  }

  // Fetch
  const { data: initialMessage, refetch: refetchInitialMessage } = useQuery({
    queryKey: ["firsMessage"],
    queryFn: openaiServices.getInitialMessage,
    enabled: false,
  });

  const { data: companionsData } = useQuery({
    queryKey: ["companionData"],
    queryFn: companionServices.getAllCompanions,
  });

  const { data: companionMessages, isFetched: isFetchCompanionMessages } =
    useQuery({
      queryKey: ["companionMessages", global.currentCompanionId],
      queryFn: () =>
        companionServices.getAllCompanionMessages(global.currentCompanionId!),
      enabled: !!global.currentCompanionId,
      staleTime: 0,
    });

  // MUtations
  const { mutate: generateMoreHistory } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.generateMoreHistory({
        messages: params.messages,
        companionId: global.currentCompanionId || "",
      }),
  });

  const { mutate: onboardingMessageMutate } = useMutation({
    mutationFn: (params: { message: Question }) =>
      openaiServices.sendMessageAndSave({
        message: params.message,
        companionId: global.currentCompanionId || "",
      }),
  });

  // Use effect to get and set the companion
  useEffect(() => {
    if (companionsData?.items && companionsData?.items.length > 0) {
      setCompanionHasOnBoarding(companionsData?.items?.[0]?.hasOnBoarding);
      global.updateCompanionId(companionsData?.items?.[0]?.companionId);
    }
  }, [companionsData]);

  //Use effect to get companionMessages. If the query has fetch, check this. If there are no companions refetchIniitlaMessage
  useEffect(() => {
    if (isFetchCompanionMessages) {
      if (companionMessages?.items && companionMessages?.items.length > 0) {
        setQuestions(
          companionMessages.items.map((item) => {
            return {
              content: item.content,
              role: item.role,
            };
          })
        );

        setPageStatus("Idle");
      } else {
        refetchInitialMessage();
      }
    }
  }, [companionMessages?.items?.length, isFetchCompanionMessages]);

  // Use effect to get initial message. This should only happen if there are no companion messages
  useEffect(() => {
    if (
      !!initialMessage &&
      companionHasOnBoarding === false &&
      isFetchCompanionMessages
    ) {
      const updatedQuestionsData = [...questions];
      updatedQuestionsData[0].content =
        initialMessage.choices[0].message.content || "";

      setQuestions(updatedQuestionsData);
      setPageStatus("Idle");
    }
  }, [initialMessage]);

  const handleNextOnboarding = (answer: string) => {
    setLoadingAnswer(true);

    const updatedQuestionsData = [...questions];
    updatedQuestionsData.push({
      role: "user",
      content: answer,
    });

    setQuestions(updatedQuestionsData);
    onboardingMessageMutate(
      {
        message: updatedQuestionsData[updatedQuestionsData.length - 1],
      },
      {
        onSuccess: (response) => {
          if (
            response.choices[0].message.content &&
            response.choices[0].message.content.includes(
              "<ONBOARDING_COMPLETE>"
            ) &&
            !companionHasOnBoarding
          ) {
            setCompanionHasOnBoarding(true);
            const assistantReply = response.choices[0].message.content || "";
            const cleanedReply = assistantReply
              .replace("<ONBOARDING_COMPLETE>", "")
              .trim();

            setQuestions((prev) => [
              ...prev,
              {
                role: "assistant",
                content: cleanedReply,
              },
            ]);
          } else {
            setQuestions((prev) => [
              ...prev,
              {
                role: "assistant",
                content: response.choices[0].message.content || "",
              },
            ]);
          }

          setLoadingAnswer(false);
        },
      }
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
    generateMoreHistory(
      {
        messages: [updatedQuestionsData[updatedQuestionsData.length - 1]],
      },
      {
        onSuccess: (response) => {
          setQuestions((prev) => [
            ...prev,
            {
              role: "assistant" as const,
              content: response.choices[0].message.content || "",
            },
          ]);

          setLoadingAnswer(false);
        },
      }
    );
  };

  const generateEmail = async () => {
    setLoadingAnswer(true);
    const response = await emailServices.createEmailCampaign(
      global.currentCompanionId || ""
    );

    navigate({ to: `/emailCampaigns/${response.emailCampaignId}` });
    setLoadingAnswer(false);
  };

  if (pageStatus === "Idle") {
    return (
      <ConversationHistoryView
        handleNext={companionHasOnBoarding ? handleNext : handleNextOnboarding}
        questions={questions}
        loadingAnswer={loadingAnswer}
        pageStatus={pageStatus}
        companionHasOnBoarding={companionHasOnBoarding}
        generateEmail={generateEmail}
      />
    );
  } else {
    return <LoadingView />;
  }
}
