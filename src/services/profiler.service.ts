import { clientAxiosClient } from "../lib/axiosClient";

async function getProfilerByEmailCampaignId(
  emailCampaignId: string
): Promise<ClientApi.GetEmailCampaignProfiler.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

  const response =
    await clientAxiosClient.get<ClientApi.GetEmailCampaignProfiler.Responses.$200>(
      `/emailCampaigns/${emailCampaignId}/profiler`,
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
      companyUrl: response.data.companyUrl,
      createdAt: response.data.createdAt,
      email: response.data.email,
      hasOnBoarding: response.data.hasOnBoarding,
      location: response.data.location,
      name: response.data.name,
      otherSourcesUrl: response.data.otherSourcesUrl,
      profilerId: response.data.profilerId,
      socialMediaUrl: response.data.socialMediaUrl,
      updatedAt: response.data.updatedAt,
    };
  }

  return {
    companionId: "",
    emailCampaignId: emailCampaignId,
    companyUrl: "",
    createdAt: "",
    email: "",
    hasOnBoarding: false,
    location: "",
    name: "",
    otherSourcesUrl: "",
    profilerId: "",
    socialMediaUrl: "",
    updatedAt: "",
  };
}

const profilerService = {
  getProfilerByEmailCampaignId,
};

export { profilerService };
