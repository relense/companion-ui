import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import OnBoardingView from "../views/OnBoardingView/OnBoardingView";
import { openaiServices } from "../services/openapi.services";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: App,
});

export type Question = {
  questionId: number;
  question: string;
  answer: string;
};

const questionsData: Question[] = [
  {
    questionId: 0,
    question: "",
    answer: "",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState(questionsData);

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["firsMessage"],
  //   queryFn: openaiServices.getInitialMessage,
  // });

  // if (data && data.choices) {
  //   questionsData[0].question = data.choices[0].message.content;
  // }

  const handleNext = (answer: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[step].answer = answer;

      return updated;
    });

    setStep(step + 1);
  };

  const updateAnswer = (answer: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[step].answer = answer;

      return updated;
    });
  };

  return (
    <OnBoardingView
      handleNext={handleNext}
      updateAnswer={updateAnswer}
      step={step}
      questions={questions}
    />
  );
}
