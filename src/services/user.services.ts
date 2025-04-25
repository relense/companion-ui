import { clientAxiosClient } from "../lib/axiosClient";

async function completeAuth(
  body: ClientApi.CompleteAuthentication.Config["requestBody"]
): Promise<ClientApi.CompleteAuthentication.Responses.$200> {
  const token = localStorage.getItem("tempNovaToken");

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
