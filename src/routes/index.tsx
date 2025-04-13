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
  {
    questionId: 0,
    question:
      "Hey! 👋 Before we dive into building the perfect cold outreach, I’d love to know your name. What should I call you?",
    answer: "",
  },
  {
    questionId: 1,
    question:
      "Nice to meet you, {{name}}. And just so I understand the bigger picture — what’s your role in the company or business?",
    answer: "",
  },
  {
    questionId: 2,
    question:
      "And if you had to sum it up in one line — what does your business or product help people do?",
    answer: "",
  },
  {
    questionId: 3,
    question: "What’s the biggest goal you’re chasing right now with outreach?",
    answer: "",
  },
  {
    questionId: 4,
    question: "Who’s your dream customer?",
    answer: "",
  },
  {
    questionId: 5,
    question:
      "“If I were your ideal client, what would you say to grab my attention in 1 sentence?",
    answer: "",
  },
  {
    questionId: 6,
    question:
      "What’s the #1 problem your product or service solves for your customers?",
    answer: "",
  },
  {
    questionId: 7,
    question: "What does success look like after someone uses your product?",
    answer: "",
  },
  {
    questionId: 8,
    question: "What platforms do you want to focus on for outreach?",
    answer: "",
  },
  {
    questionId: 9,
    question:
      "Anything else you want me to know so I can be your best outreach wingman?",
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
