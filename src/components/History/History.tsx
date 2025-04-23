import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import HistoryView from "../../views/HistoryView/HistoryView";
import type { Question } from "../../utils/prompts";
import { openaiServices } from "../../services/openapi.services";

const questionsData: Question[] = [
  {
    role: "assistant",
    content: "",
  },
];

const History = () => {
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: (params: { messages: Question[] }) =>
      openaiServices.sendMessage({
        messages: params.messages,
      }),
  });

  useEffect(() => {
    const conversation = localStorage.getItem("hasGeneratedEmail") || "";
    setQuestions(JSON.parse(conversation));
  }, []);

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
          setQuestions((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response.choices[0].message.content,
            },
          ]);

          setLoadingAnswer(false);
        },
      }
    );
  };

  return (
    <HistoryView
      handleNext={handleNext}
      questions={questions}
      loadingAnswer={loadingAnswer}
    />
  );
};

export default History;
