import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import "../App.css";

export const Route = createFileRoute("/app")({
  component: App,
});

const questions = [
  { questionId: "1", question: "Tell me your name", answer: "" },
  { questionId: "2", question: "What are you offering?", answer: "" },
  { questionId: "3", question: "Who are you trying to reach?", answer: "" },
  {
    questionId: "4",
    question: "What’s your goal for the email?",
    answer: "",
  },
  {
    questionId: "5",
    question: "Preferred tone? (e.g. friendly, direct)",
    answer: "",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(questions);

  const handleNext = (answer: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step].answer = answer;
      return updated;
    });
    setStep(step + 1);
  };

  const handlePrevious = (questionId: number, answer: string) => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white text-gray-900">
      <div className="max-w-xl w-full p-6 text-center">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome to <span className="font-bold">Outreach Companion</span>,
          let's make cold outreach. {step === 0 ? "Tell me your name." : ""}
        </h1>
        {step < questions.length ? (
          <div>
            <p>{questions[step].question}</p>
            <input
              type="text"
              placeholder={questions[step].question}
              className="w-full border p-3 rounded mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNext(e.currentTarget.value);
              }}
            />
            <p className="text-sm text-gray-500">Press Enter to continue</p>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            // onClick={handleGenerate}
          >
            Generate First Email
          </button>
        )}
      </div>
    </div>
  );
}
