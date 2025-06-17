import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, SearchIcon, TicketIcon, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 backdrop-blur-md bg-black/30">
      {/* Logo */}
      <Link to="/">
        <h2 className="text-2xl font-bold text-white mb-4">
          <span className="text-pink-600">Show</span>Mate
        </h2>
      </Link>

      {/* Menu Links */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:w-full max-md:h-screen max-md:bg-black/80 max-md:backdrop-blur-md max-md:flex-col max-md:justify-center max-md:items-center z-40 flex md:flex-row items-center gap-8 text-white font-medium transition-all duration-300 ${
          isOpen ? "flex" : "max-md:hidden"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 h-6 w-6 cursor-pointer text-white"
          onClick={() => setIsOpen(false)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className="hover:text-primary transition"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
          className="hover:text-primary transition"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className="hover:text-primary transition"
        >
          Theaters
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className="hover:text-primary transition"
        >
          Releases
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorites"
          className="hover:text-primary transition"
        >
          Favorites
        </Link>
      </div>

      {/* Search and Login */}
      <div className="flex items-center gap-5">
        <SearchIcon className="max-md:hidden w-6 h-6 text-white cursor-pointer hover:text-primary" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-5 py-1 bg-primary hover:bg-primary-dull transition rounded-full font-semibold text-white shadow"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Booking"
                labelIcon={<TicketIcon width={15} />}
                onClick={() => navigate("/mybookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

        <MenuIcon
          className="md:hidden w-8 h-8 text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export default Navbar;
