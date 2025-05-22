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

async function getEmailCampaign(emailCampaignId: string) {
  try {
    const token = localStorage.getItem("tempNovaToken");

    const response =
      await clientAxiosClient.get<ClientApi.GetEmailCampaign.Responses.$200>(
        `/emailCampaigns/${emailCampaignId}`,
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
        name: response.data.name,
        createdAt: response.data.createdAt,
        emails: response.data.emails,
        isIndividual: response.data.isIndividual,
        profilerId: response.data.profilerId,
        messages: response.data.messages,
      };
    }
  } catch (error: any) {
    console.log(error);
  }
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

async function updateEmailCampaign(params: {
  emailCampaignId: string;
  name: string;
  isIndividual: boolean;
}) {
  try {
    const token = localStorage.getItem("tempNovaToken");

    const response =
      await clientAxiosClient.patch<ClientApi.UpdateEmailCampaign.Responses.$200>(
        `/emailCampaigns/${params.emailCampaignId}`,
        {
          name: params.name,
          isIndividual: params.isIndividual,
        },
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
  updateEmailCampaign,
};

export { emailServices };
