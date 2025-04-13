import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import OnBoardingView from "../views/OnBoardingView/OnBoardingView";

export const Route = createFileRoute("/")({
  component: App,
});

export type Question = {
  questionId: number;
  question: string;
  answer: string;
};

const questionsData: Question[] = [
  { questionId: 0, question: "Tell me your name", answer: "" },
  { questionId: 1, question: "What are you offering?", answer: "" },
  { questionId: 2, question: "Who are you trying to reach?", answer: "" },
  {
    questionId: 3,
    question: "What’s your goal for the email?",
    answer: "",
  },
  {
    questionId: 4,
    question: "Preferred tone? (e.g. friendly, direct)",
    answer: "",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState(questionsData);

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
