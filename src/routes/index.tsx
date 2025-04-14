import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";

import OnBoardingView from "../views/OnBoardingView/OnBoardingView";
import { openaiServices } from "../services/openapi.services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: App,
});

export type Question = {
  role: "assistant" | "user";
  content: string;
};

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(questionsData);

  const { data, isLoading, error } = useQuery({
    queryKey: ["firsMessage"],
    queryFn: openaiServices.getInitialMessage,
  });

  const { mutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessage({
        messages: params.messages,
      }),
  });

  if (data && data.choices) {
    questionsData[0].content = data.choices[0].message.content;
  }

  const handleNext = (answer: string) => {
    setQuestions((prev) => {
      const updatedQuestionsData = [...prev];
      updatedQuestionsData.push({
        role: "user",
        content: answer,
      });

      mutate(
        { messages: updatedQuestionsData },
        {
          onSuccess: (response) => {
            setQuestions((prev) => [
              ...prev,
              {
                role: "assistant",
                content: response.choices[0].message.content,
              },
            ]);
          },
        }
      );

      return updatedQuestionsData;
    });
  };

  return <OnBoardingView handleNext={handleNext} questions={questions} />;
}
