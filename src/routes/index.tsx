import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "../hooks/useAuth";
import LoadingView from "../views/LoadingView/LoadingView";
import OnBoardingView from "../views/OnBoardingView/OnBoardingView";
import type { Question } from "../utils/prompts";
import { openaiServices } from "../services/openapi.services";

export const Route = createFileRoute("/")({
  component: App,
});

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function App() {
  const [appStatus, setAppStatus] = useState<"Loading" | "Onboarding">(
    "Loading"
  );
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [showGeneratorButtons, setShowGeneratorButtons] =
    useState<boolean>(false);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(true);

  const auth = useAuth();
  const navigate = useNavigate();

  const { data, refetch: refetchInitialMessage } = useQuery({
    queryKey: ["initialMessage"],
    queryFn: openaiServices.getInitialMessage,
    enabled: false,
  });

  const { mutate: sendMessageMutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessage({
        messages: params.messages,
      }),
  });

  useEffect(() => {
    if (auth.status === "Unauthenticated") {
      setAppStatus("Onboarding");
    } else if (auth.status === "Initializing") {
      auth.checkUserSession();
    } else {
      navigate({ to: "/home" });
    }
  }, [auth.status]);

  useEffect(() => {
    if (appStatus === "Onboarding" && auth.status === "Unauthenticated") {
      const conversation = localStorage.getItem("userMessages");

      if (conversation && !conversation.includes("<ONBOARDING_COMPLETE>")) {
        const parsedConversation: Question[] = JSON.parse(conversation);
        if (parsedConversation[parsedConversation.length - 1].role === "user") {
          sendMessageMutate(
            { messages: JSON.parse(conversation) },
            {
              onSuccess: (response) => {
                if (
                  response.choices[0].message.content &&
                  response.choices[0].message.content.includes(
                    "<ONBOARDING_COMPLETE>"
                  )
                ) {
                  setShowGeneratorButtons(true);

                  setQuestions(() => [
                    ...JSON.parse(conversation),
                    {
                      role: "assistant",
                      content: response.choices[0].message.content,
                    },
                  ]);
                } else {
                  setQuestions(() => [
                    ...JSON.parse(conversation),
                    {
                      role: "assistant",
                      content: response.choices[0].message.content || "",
                    },
                  ]);
                }

                localStorage.setItem(
                  "userMessages",
                  JSON.stringify([
                    ...JSON.parse(conversation),
                    {
                      role: "assistant",
                      content: response.choices[0].message.content,
                    },
                  ])
                );

                setAppStatus("Onboarding");

                setLoadingAnswer(false);
              },
            }
          );
        } else {
          setQuestions(JSON.parse(conversation));
          setLoadingAnswer(false);
        }
      } else if (
        conversation &&
        conversation.includes("<ONBOARDING_COMPLETE>")
      ) {
        setQuestions(JSON.parse(conversation));
        setShowGeneratorButtons(true);
        setLoadingAnswer(false);
      } else {
        if (questions[0].content === "") refetchInitialMessage();
      }
    }
  }, [auth, appStatus]);

  useEffect(() => {
    if (data && data.choices) {
      if (
        data.choices[0].message.content &&
        data.choices[0].message.content.includes("<ONBOARDING_COMPLETE>")
      ) {
        setShowGeneratorButtons(true);
      }
      const updatedQuestionsData = [...questions];
      updatedQuestionsData[0].content = data.choices[0].message.content || "";

      setQuestions(updatedQuestionsData);
      setAppStatus("Onboarding");
      setLoadingAnswer(false);
    }
  }, [data]);

  const handleNext = (answer: string) => {
    setLoadingAnswer(true);

    const updatedQuestionsData = [...questions];
    updatedQuestionsData.push({
      role: "user",
      content: answer,
    });

    setQuestions(updatedQuestionsData);
    sendMessageMutate(
      { messages: updatedQuestionsData },
      {
        onSuccess: (response) => {
          if (
            response.choices[0].message.content &&
            response.choices[0].message.content.includes(
              "<ONBOARDING_COMPLETE>"
            )
          ) {
            setShowGeneratorButtons(true);
            setQuestions((prev) => [
              ...prev,
              {
                role: "assistant",
                content: response.choices[0].message.content || "",
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

          localStorage.setItem(
            "userMessages",
            JSON.stringify(updatedQuestionsData)
          );

          setLoadingAnswer(false);
        },
      }
    );
  };

  if (appStatus === "Onboarding") {
    return (
      <OnBoardingView
        handleNext={handleNext}
        questions={questions}
        showGeneratorButtons={showGeneratorButtons}
        loadingAnswer={loadingAnswer}
      />
    );
  } else {
    return <LoadingView />;
  }
}
