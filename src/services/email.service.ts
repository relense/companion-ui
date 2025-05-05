import { clientAxiosClient } from "../lib/axiosClient";

async function createEmailCampaign(
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

const emailServices = {
  createEmailCampaign,
};

export { emailServices };
