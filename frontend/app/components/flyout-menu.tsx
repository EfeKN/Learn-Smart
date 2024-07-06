import Cookies from "js-cookie";
import { useState } from "react";
import { FaCog, FaUser } from "react-icons/fa";

const handleLogout = () => {
  Cookies.remove("authToken");
  window.location.href = "/login";
};

const navigateToProfile = () => {
  window.location.href = "/profile";
};

const navigateToSettings = () => {
  window.location.href = "/settings";
};

const FlyoutMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <button
        type="button"
        className={`inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ${
          isOpen ? "active" : ""
        }`}
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <u>Menu</u>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 sm:p-4">
              <div className="flex flex-col gap-1">
                <a
                  href="#"
                  onClick={navigateToProfile}
                  className="flex items-center text-base font-medium text-black hover:text-gray-900 py-2 px-4"
                >
                  <FaUser className="w-4 h-4 mr-8" />
                  Profile
                </a>
                <a
                  href="#"
                  onClick={navigateToSettings}
                  className="flex items-center text-base font-medium text-black hover:text-gray-900 py-2 px-4"
                >
                  <FaCog className="w-4 h-4 mr-4" />
                  Settings
                </a>
                <div className="flex justify-end text-sm text-gray-500 mt-0">
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="hover:text-gray-700 py-2 px-4"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyoutMenu;
