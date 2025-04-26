import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { Question } from "../utils/prompts";
import { openaiServices } from "../services/openapi.services";
import ConversationHistoryView from "../views/ConversationHistoryView/ConversationHistoryView";
import { companionServices } from "../services/companion.services";

export const Route = createFileRoute("/history")({
  component: History,
});

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function History() {
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const [currentCompanionId, setCurrentCompanionId] = useState<
    string | undefined
  >(undefined);
  const [companionHasOnBoarding, setCompanionHasOnBoarding] =
    useState<boolean>(false);

  const { data: initialMessage } = useQuery({
    queryKey: ["firsMessage"],
    queryFn: openaiServices.getInitialMessage,
  });

  const { mutate: generateMoreHistory } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.generateMoreHistory({
        messages: params.messages,
      }),
  });

  const { mutate: onboardingMessageMutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessageAndSave({
        messages: params.messages,
        companionId: currentCompanionId || "",
      }),
  });

  const { data: companionsData } = useQuery({
    queryKey: ["companionData"],
    queryFn: companionServices.getAllCompanions,
  });

  const { data: companionMessages } = useQuery({
    queryKey: ["companionMessages", currentCompanionId],
    queryFn: () =>
      companionServices.getAllCompanionMessages(currentCompanionId!),
    enabled: !!currentCompanionId && companionHasOnBoarding,
  });

  useEffect(() => {
    if (companionsData?.items?.length) {
      setCurrentCompanionId(companionsData?.items?.[0]?.companionId);
      setCompanionHasOnBoarding(companionsData?.items?.[0]?.hasOnBoarding);
    }

    if (companionMessages?.items) {
      setQuestions(
        companionMessages.items.map((item) => {
          return {
            content: item.content,
            role: item.role,
          };
        })
      );
    }
  }, [companionsData, companionMessages]);

  useEffect(() => {
    if (
      initialMessage &&
      !companionHasOnBoarding &&
      questions[0].content === ""
    ) {
      const updatedQuestionsData = [...questions];
      updatedQuestionsData[0].content =
        initialMessage.choices[0].message.content || "";

      setQuestions(updatedQuestionsData);
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
          updatedQuestionsData[updatedQuestionsData.length - 1],
          updatedQuestionsData[updatedQuestionsData.length - 2],
        ],
      },
      {
        onSuccess: (response) => {
          if (
            response.choices[0].message.content &&
            response.choices[0].message.content.includes(
              "<ONBOARDING_COMPLETE>"
            )
          ) {
            localStorage.setItem("userMessages", JSON.stringify(questions));
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
      { messages: updatedQuestionsData },
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
    />
  );
}
