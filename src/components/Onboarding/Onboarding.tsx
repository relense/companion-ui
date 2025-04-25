import { useEffect, useState } from "react";

import OnBoardingView from "../../views/OnBoardingView/OnBoardingView";
import type { Question } from "../../utils/prompts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { openaiServices } from "../../services/openapi.services";

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

const Onboarding = () => {
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [showGeneratorButtons, setShowGeneratorButtons] =
    useState<boolean>(false);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  const { data, refetch: refetchInitialMessage } = useQuery({
    queryKey: ["firsMessage"],
    queryFn: openaiServices.getInitialMessage,
    enabled: false,
  });

  const { mutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessage({
        messages: params.messages,
      }),
  });

  const { mutate: createEmail } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.createEmail({
        messages: params.messages,
      }),
  });

  const generateEmail = () => {
    setLoadingAnswer(true);
    createEmail(
      { messages: questions },
      {
        onSuccess: (response) => {
          setEmail(response.choices[0].message.content);
          setLoadingAnswer(false);
        },
      }
    );
  };

  useEffect(() => {
    const conversation = localStorage.getItem("userMessages");
    if (conversation) {
      setQuestions(JSON.parse(conversation));
      setShowGeneratorButtons(true);
    } else {
      refetchInitialMessage();
    }
  }, []);

  useEffect(() => {
    if (data && data.choices) {
      if (data.choices[0].message.content.includes("<ONBOARDING_COMPLETE>")) {
        setShowGeneratorButtons(true);
        localStorage.setItem("userMessages", JSON.stringify(questions));
      } else {
        const updatedQuestionsData = [...questions];
        updatedQuestionsData[0].content = data.choices[0].message.content;

        setQuestions(updatedQuestionsData);
      }

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
    mutate(
      { messages: updatedQuestionsData },
      {
        onSuccess: (response) => {
          if (
            response.choices[0].message.content.includes(
              "<ONBOARDING_COMPLETE>"
            )
          ) {
            localStorage.setItem("userMessages", JSON.stringify(questions));
            setShowGeneratorButtons(true);
          } else {
            setQuestions((prev) => [
              ...prev,
              {
                role: "assistant",
                content: response.choices[0].message.content,
              },
            ]);
          }

          setLoadingAnswer(false);
        },
      }
    );
  };

  return (
    <OnBoardingView
      handleNext={handleNext}
      questions={questions}
      showGeneratorButtons={showGeneratorButtons}
      loadingAnswer={loadingAnswer}
      email={email}
    />
  );
};

export default Onboarding;
