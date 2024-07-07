import Cookies from "js-cookie";
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

export default function FlyoutMenu({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="relative z-50">
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
    </div>
  );
}
