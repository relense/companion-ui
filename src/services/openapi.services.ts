import { axiosClient } from "@/lib/axiosClient";

async function getInitialMessage(): Promise<OpenaiApi.GetInitialMessage.Responses.$200> {
  const response =
    await axiosClient.get<OpenaiApi.GetInitialMessage.Responses.$200>("/gpt");
  console.log(response.data);

  return response.data;
}

async function sendMessage(params: { name: string | undefined }) {
  const response =
    await axiosClient.post<OpenaiApi.GetInitialMessage.Responses.$200>("/gpt");

  return response.data;
}

const openaiServices = {
  getInitialMessage,
  sendMessage,
};

export { openaiServices };
