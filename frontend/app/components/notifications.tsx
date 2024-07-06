import { useState } from "react";
import { HiMiniBell } from "react-icons/hi2";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleSeeMoreClick = () => {
    window.location.href = "/notifications"; // Navigate to notifications page
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="text-lm font-medium text-black flex items-center space-x-1"
        onClick={toggleNotifications}
        title="Notifications"
      >
        <HiMiniBell className="h-5 w-5" />
      </button>

      {/* Notifications dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-3xl">
          <div className="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Notifications
              </h2>
              <button
                type="button"
                onClick={handleSeeMoreClick}
                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                See More
              </button>
            </div>
            <div className="h-40 overflow-y-auto">
              <ul className="space-y-4 max-h-50">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={item}
                    className="flex items-start cursor-pointer"
                    onClick={() => console.log(`Clicked notification ${item}`)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80"
                      alt=""
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">
                        <time dateTime="2023-03-16">July 6, 2024</time>
                      </p>
                      <a
                        href="#"
                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                      >
                        Example {item}
                      </a>
                      <p className="mt-1 text-sm text-gray-500">Lorem Ipsum.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
