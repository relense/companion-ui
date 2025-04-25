import { clientAxiosClient } from "@/lib/axiosClient";

async function getAllCompanionMessages(
  companionId: string
): Promise<ClientApi.GetMessagesByCompanion.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.get<ClientApi.GetMessagesByCompanion.Responses.$200>(
      `/companions/${companionId}/messages`,

      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

async function getAllCompanions(): Promise<ClientApi.GetCompanions.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.get<ClientApi.GetCompanions.Responses.$200>(
      `/companions`,

      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

const companionServices = {
  getAllCompanionMessages,
  getAllCompanions,
};

export { companionServices };
