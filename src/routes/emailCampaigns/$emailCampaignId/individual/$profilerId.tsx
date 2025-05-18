import { createFileRoute } from "@tanstack/react-router";
import EmailCampaignIndividualOnboardingView from "../../../../views/EmailCampaignIndividualOnboardingView/EmailCampaignIndividualOnboardingView";
import { useState } from "react";
import type { Question } from "../../../../utils/prompts";

export const Route = createFileRoute(
  "/emailCampaigns/$emailCampaignId/individual/$profilerId"
)({
  component: ProfilerId,
});

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "Hi",
  },
];

function ProfilerId() {
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(questionsData);

  const handleNext = (answer: string) => {
    setLoadingAnswer(true);

    const updatedQuestionsData = [...questions];
    updatedQuestionsData.push({
      role: "user",
      content: answer,
    });

    setQuestions(updatedQuestionsData);
  };

  return (
    <EmailCampaignIndividualOnboardingView
      handleNext={handleNext}
      loadingAnswer={loadingAnswer}
      questions={questions}
    />
  );
}
