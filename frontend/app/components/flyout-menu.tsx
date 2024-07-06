import React, { useState } from 'react';
import Cookies from 'js-cookie';

const handleLogout = () => {
  Cookies.remove('authToken');
  window.location.href = '/login';
};

const navigateToNotifications = () => {
    window.location.href = '/notifications';
};

const navigateToProfile = () => {
  window.location.href = '/profile';
};

 const navigateToSettings = () => {
  window.location.href = '/settings';
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
        className={`inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <u>Menu</u>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-screen max-w-md md:max-w-3xl">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="relative bg-white px-5 py-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center border-r-2 border-gray-300 pr-4">
                  <a href="#" onClick={navigateToProfile} className="text-lg font-medium text-black hover:text-gray-900">
                    Profile
                  </a>
                </div>
                <div className="flex items-center justify-center">
                  <a href="#" onClick={navigateToSettings} className="text-lg font-medium text-black hover:text-gray-900">
                    Settings
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8 mt-4 rounded-md">
                <button
                    type="button"
                    onClick={navigateToNotifications}
                    className="text-lm font-medium text-black"
                >
                    <u>Notifications</u>
                </button>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start">
                    <img
                        src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80"
                        alt="" className="h-20 w-20 rounded-md object-cover"/>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">
                        <time dateTime="2023-03-16">July 6, 2024</time>
                      </p>
                      <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Example 1
                      </a>
                      <p className="mt-1 text-sm text-gray-500">Lorem Ipsum.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end text-sm text-gray-500 mt-4">
                <a href="#" onClick={handleLogout} className="hover:text-gray-700">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyoutMenu;
