import { axiosClient } from "@/lib/axiosClient";

async function getInitialMessage(): Promise<OpenaiApi.GetInitialMessage.Responses.$200> {
  const response =
    await axiosClient.get<OpenaiApi.GetInitialMessage.Responses.$200>("/gpt");

  return response.data;
}

async function sendMessage(
  body: OpenaiApi.SendOpenaiMessages.Config["requestBody"]
): Promise<OpenaiApi.SendOpenaiMessages.Responses.$200> {
  const response =
    await axiosClient.post<OpenaiApi.SendOpenaiMessages.Responses.$200>(
      "/gpt",
      body
    );

  return response.data;
}

async function createEmail(
  body: OpenaiApi.CreateEmail.Config["requestBody"]
): Promise<OpenaiApi.CreateEmail.Responses.$200> {
  const response = await axiosClient.post<OpenaiApi.CreateEmail.Responses.$200>(
    "/gpt-email",
    body
  );

  return response.data;
}
const openaiServices = {
  getInitialMessage,
  sendMessage,
  createEmail,
};

export { openaiServices };
