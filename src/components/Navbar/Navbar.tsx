import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="flex w-full h-15 p-10 items-center text-white">
      <div className="flex w-full cursor-pointer gap-2 items-center">
        <img className="w-12 h-12" src="/imgs/logo.png" alt="Companion Logo" />
        <div>Outreach Companion</div>
      </div>
      <Link to="/login" className="flex w-full justify-end cursor-pointer">
        <div>Login</div>
      </Link>
    </div>
  );
};

export default Navbar;
