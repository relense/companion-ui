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

async function getEmailCampaign(
  emailCampaignId: string
): Promise<ClientApi.GetEmailCampaign.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.get<ClientApi.CreateEmailCampaign.Responses.$201>(
      `/emailCampaign/${emailCampaignId}`,
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
    companionId: "",
    emailCampaignId: emailCampaignId,
  };
}

async function getAllEmailCampaigns(
  companionId: string
): Promise<ClientApi.GetEmailCampaigns.Responses.$200> {
  try {
    const token = localStorage.getItem("tempNovaToken");

    const response =
      await clientAxiosClient.get<ClientApi.GetEmailCampaigns.Responses.$200>(
        `/companions/${companionId}/emailCampaigns`,
        {
          headers: {
            apikey: token,
          },
        }
      );

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

const emailServices = {
  createEmailCampaign,
  getEmailCampaign,
  getAllEmailCampaigns,
};

export { emailServices };
