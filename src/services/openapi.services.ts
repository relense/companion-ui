import { publicAxiosClient, clientAxiosClient } from "@/lib/axiosClient";

async function getInitialMessage(): Promise<OpenaiApi.GetInitialMessage.Responses.$200> {
  const response =
    await publicAxiosClient.get<OpenaiApi.GetInitialMessage.Responses.$200>(
      "/gpt"
    );

  return response.data;
}

async function sendMessage(
  body: OpenaiApi.SendOpenaiMessages.Config["requestBody"]
): Promise<OpenaiApi.SendOpenaiMessages.Responses.$200> {
  const response =
    await publicAxiosClient.post<OpenaiApi.SendOpenaiMessages.Responses.$200>(
      "/gpt",
      body
    );

  return response.data;
}

async function sendMessageAndSave(
  body: ClientApi.SendMessagesAndSave.Config["requestBody"]
): Promise<ClientApi.SendMessagesAndSave.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.post<ClientApi.SendMessagesAndSave.Responses.$200>(
      "/gpt/messages",
      body,
      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

async function generateMoreHistory(
  body: ClientApi.CreateMoreHistory.Config["requestBody"]
): Promise<ClientApi.CreateMoreHistory.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");
  const response =
    await clientAxiosClient.post<ClientApi.CreateMoreHistory.Responses.$200>(
      "/gpt/history",
      body,
      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

async function generateMoreProfiler(
  body: ClientApi.SendProfilerMessage.Config["requestBody"]
): Promise<ClientApi.SendProfilerMessage.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");
  const response =
    await clientAxiosClient.post<ClientApi.SendProfilerMessage.Responses.$200>(
      "/gpt/profiler",
      body,
      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

const openaiServices = {
  getInitialMessage,
  sendMessage,
  sendMessageAndSave,
  generateMoreHistory,
  generateMoreProfiler,
};

export { openaiServices };
