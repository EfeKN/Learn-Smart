export default function Notifications({ isOpen }: { isOpen: boolean }) {
  const handleSeeMoreClick = () => {
    window.location.href = "/notifications"; // Navigate to notifications page
  };

  const notifications = [1, 2, 3, 4, 5];

  if (!isOpen) return null;

  return (
    <div
      className={`relative transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute right-0 mt-2 w-screen max-w-3xl">
        <div className="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 border-b border-black">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
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
              {notifications.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start cursor-pointer bg-gray-200 p-2 rounded-md"
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
    </div>
  );
}
