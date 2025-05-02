import { clientAxiosClient } from "../lib/axiosClient";

async function completeAuth(
  body: ClientApi.CompleteAuthentication.Config["requestBody"],
  token: string
): Promise<ClientApi.CompleteAuthentication.Responses.$200> {
  const response =
    await clientAxiosClient.post<ClientApi.CompleteAuthentication.Responses.$200>(
      "/auth/complete",
      body,
      {
        headers: {
          apikey: token,
        },
      }
    );

  return response.data;
}

const userServices = {
  completeAuth,
};

export { userServices };
