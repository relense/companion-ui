import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Question } from "../utils/prompts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { openaiServices } from "../services/openapi.services";
import { companionServices } from "../services/companion.services";
import ConversationHistoryView from "../views/ConversationHistoryView/ConversationHistoryView";
import { useAuth } from "../hooks/useAuth";

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
  const [currentCompanionId, setCurrentCompanionId] = useState<
    string | undefined
  >(undefined);
  const auth = useAuth();
  const navigate = useNavigate();

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
      queryKey: ["companionMessages", currentCompanionId],
      queryFn: () =>
        companionServices.getAllCompanionMessages(currentCompanionId!),
      enabled: !!currentCompanionId,
      staleTime: 0,
    });

  // MUtations
  const { mutate: generateMoreHistory } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.generateMoreHistory({
        messages: params.messages,
        companionId: currentCompanionId || "",
      }),
  });

  const { mutate: onboardingMessageMutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessageAndSave({
        messages: params.messages,
        companionId: currentCompanionId || "",
      }),
  });

  useEffect(() => {
    localStorage.removeItem("userMessages");
  }, []);

  // Use effect to get and set the companion
  useEffect(() => {
    if (companionsData?.items && companionsData?.items.length > 0) {
      setCurrentCompanionId(
        companionsData?.items?.[companionsData?.items.length - 1]?.companionId
      );
      setCompanionHasOnBoarding(
        companionsData?.items?.[companionsData?.items.length - 1]?.hasOnBoarding
      );
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
        messages: [
          updatedQuestionsData[updatedQuestionsData.length - 2],
          updatedQuestionsData[updatedQuestionsData.length - 1],
        ],
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

  return (
    <ConversationHistoryView
      handleNext={companionHasOnBoarding ? handleNext : handleNextOnboarding}
      questions={questions}
      loadingAnswer={loadingAnswer}
      pageStatus={pageStatus}
    />
  );
}
