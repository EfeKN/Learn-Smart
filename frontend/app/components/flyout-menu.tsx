import React from 'react';
import Cookies from 'js-cookie';

const handleLogout = () => {
  Cookies.remove('authToken');
  window.location.href = '/login';
};

const FlyoutMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <div className="py-2">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            Menu
            <svg
              className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 bg-white shadow-lg transform transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } w-full max-w-7xl`}
        style={{ height: 'auto' }}
      >
        <div className="pt-2">
          <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8 lg:py-4">
            <div className="grid grid-cols-1 gap-1">
              <a
                href="#"
                className="flex items-center gap-x-2 p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-x-2 p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                Settings
              </a>
              <a
                href="#"
                onClick={handleLogout}
                className="flex items-center gap-x-2 p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyoutMenu;
