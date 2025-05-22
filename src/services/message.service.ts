import { clientAxiosClient } from "../lib/axiosClient";

async function getMessagesByProfilerId(
  companionId: string
): Promise<ClientApi.CreateEmailCampaign.Responses.$201> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.post<ClientApi.CreateEmailCampaign.Responses.$201>(
      `/companions/${companionId}/create-campaign`,
      {},
      {
        headers: {
          apikey: token,
        },
      }
    );

  if (response) {
    return {
      companionId: response.data.companionId,
      emailCampaignId: response.data.emailCampaignId,
    };
  }

  return {
    companionId: companionId,
    emailCampaignId: "",
  };
}

const messageService = {
  getMessagesByProfilerId,
};

export { messageService };
