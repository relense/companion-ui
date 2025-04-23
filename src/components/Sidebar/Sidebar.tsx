import {
  faPenToSquare,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

const Sidebar = () => {
  return (
    <div className="h-full w-100 border-r-2 bg-neutral-900 border-r-black text-gray-300">
      <div className="h-15 p-10 flex justify-between ">
        <FontAwesomeIcon icon={faTableColumns} size="xl" />
        <FontAwesomeIcon icon={faPenToSquare} size="xl" />
      </div>
      <div className="flex flex-col gap-6">
        <Link
          to={"/history"}
          className="flex px-10 py-4 text-xl items-center cursor-pointer hover:bg-gray-500 font-bold"
        >
          History
        </Link>
        <div className="flex w-full  text-lg flex-col font-bold">
          <div className="px-10 py-2">Today</div>
          <Link
            to={"/home"}
            className="flex flex-1 px-10 py-2 text-xl cursor-pointer hover:bg-gray-500 font-bold"
          >
            Email Campaign 1
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
