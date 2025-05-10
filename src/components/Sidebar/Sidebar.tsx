import {
  faPenToSquare,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { emailServices } from "../../services/email.service";
import { useGlobal } from "../../hooks/useGlobal";

const Sidebar = () => {
  const global = useGlobal();

  const { data } = useQuery({
    queryKey: ["getAllCampaigns", global.currentCompanionId],
    queryFn: () =>
      emailServices.getAllEmailCampaigns(global.currentCompanionId),
  });

  const renderEmailCampaignLink = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex w-full  text-lg flex-col font-bold">
          {Array.isArray(data?.items) &&
            data?.items.map((item) => {
              return (
                <Link
                  key={item.emailCampaignId}
                  to={`/emailCampaigns/$campaignId`}
                  params={{ campaignId: item.emailCampaignId }}
                  className="flex flex-1 px-10 py-2 text-xl cursor-pointer hover:bg-gray-500 font-bold"
                >
                  {item?.name || "Companion"}
                </Link>
              );
            })}
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex w-full  text-lg flex-col font-bold">
          <Link
            to={`/home`}
            className="flex flex-1 px-10 py-2 text-xl cursor-pointer hover:bg-gray-500 font-bold"
          >
            History
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-100 border-r-2 bg-neutral-900 border-r-black text-gray-300">
      <div className="h-15 p-10 flex justify-between ">
        <FontAwesomeIcon icon={faTableColumns} size="xl" />
        <FontAwesomeIcon icon={faPenToSquare} size="xl" />
      </div>
      {renderHistory()}
      {renderEmailCampaignLink()}
    </div>
  );
};

export default Sidebar;
