import {
  faComment,
  faEnvelope,
  faEnvelopesBulk,
  faPenToSquare,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";

import { emailServices } from "../../services/email.service";
import { useGlobal } from "../../hooks/useGlobal";
import { useState } from "react";

const Sidebar = () => {
  const [hideSidebar, setHideSidebar] = useState<boolean>(false);
  const global = useGlobal();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (pathStart: string) => pathname.startsWith(pathStart);

  const { data } = useQuery({
    queryKey: ["getAllCampaigns", global.currentCompanionId],
    queryFn: () =>
      emailServices.getAllEmailCampaigns(global.currentCompanionId),
    enabled: global.currentCompanionId !== "",
  });

  const renderEmailCampaignLink = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex w-full  text-lg flex-col font-bold">
          <div className="flex flex-1 px-10 py-2 text-sm text-gray-400 cursor-pointer ">
            Emails
          </div>
          {Array.isArray(data?.items) &&
            data?.items.map((item) => {
              return (
                <Link
                  key={item.emailCampaignId}
                  to={`/emailCampaigns/$emailCampaignId`}
                  params={{ emailCampaignId: item.emailCampaignId }}
                  className={`flex flex-1 px-10 py-2 text-xl cursor-pointer items-center gap-2 hover:bg-gray-500 font-bold ${isActive(`/emailCampaigns/${item.emailCampaignId}`) ? "bg-gray-600" : ""}`}
                >
                  {item.isIndividual === true ? (
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="pr-2 w-4 h-4"
                    />
                  ) : item.isIndividual === null ? (
                    ""
                  ) : (
                    <FontAwesomeIcon
                      icon={faEnvelopesBulk}
                      className="pr-2 w-4 h-4"
                    />
                  )}

                  {item.isIndividual === true
                    ? "I: "
                    : item.isIndividual === null
                      ? ""
                      : "M: "}
                  {item?.name}
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
            className={`flex flex-1 px-10 py-2 text-xl cursor-pointer hover:bg-gray-500 font-bold items-center gap-4 ${isActive("/home") ? "bg-gray-600" : ""}`}
          >
            <FontAwesomeIcon icon={faComment} />
            Companion
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-full ${
        !hideSidebar ? "w-[350px]" : "w-[60px]"
      } bg-neutral-900 border-r-2 border-r-black text-gray-300 overflow-hidden`}
    >
      <div className="h-15 p-4 flex justify-between items-center">
        <FontAwesomeIcon
          className="cursor-pointer hover:text-gray-400"
          icon={faTableColumns}
          size="xl"
          onClick={() => setHideSidebar((prev) => !prev)}
        />
        <div
          className={`transition-opacity duration-300 ${
            !hideSidebar ? "opacity-100" : "opacity-0"
          }`}
        >
          <FontAwesomeIcon icon={faPenToSquare} size="xl" />
        </div>
      </div>

      <div className={`relative h-full w-full`}>
        <div
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out ${
            !hideSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {!hideSidebar && renderHistory()}
          {!hideSidebar && renderEmailCampaignLink()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
