export default function Profile() {
  return (
    <div className="mt-14 shadow bg-white h-screen">
      <div>
        <div
          className="w-full justify-center flex flex-col md:relative bg-gray-100 md:rounded-bl-lg md:rounded-br-lg
                        bg-gradient-to-b from-gray-100 via-gray-100 to-gray-400 w-300 h-96"
        >
          <img
            src="./images/profile_photo_cat.jpg"
            className="rounded-full md:absolute top-48 inset-x-96 border-4 border-white w-42 h-42"
            title="profile photo"
          />
        </div>

        <div className="flex justify-center flex-col mt-5 mb-3.5">
          <h1 className="text-center font-bold text-3xl">Name</h1>
          <a href="#" className="text-center text-gray-600 font-semibold">
            What to put here?
          </a>
          <hr className="full flex self-center w-2/3 mt-2" />
        </div>

        <div className="w-full flex justify-center mb-2.5">
          <ul className="flex px-5 py-1.5">
            <li className="px-3 font-semibold text-gray-600">
              <a href="#">Courses</a>
            </li>
          </ul>
          <ul className="flex mb:pl-14">
            <li className="px-2 font-semibold">
              <button
                className="bg-gray-200 px-5 py-1 rounded-lg text-black font-semibold"
                type="button"
              >
                <i className="bx bx-edit-alt mr-2 text-xl"></i>
                Edit Profile
              </button>
            </li>
            <li className="px-2 font-semibold">
              <button
                className="bg-gray-200 px-3 py-1 rounded-lg text-black font-semibold"
                type="button"
              >
                ...(is this neccecary?)
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center h-screen bg-gray-100 mr-12 mt-4">
        <div className="p-4 shadow rounded-lg bg-white w-80">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">Courses</h1>
            <div className="text-lg text-gray-700 hover:bg-blue-200">
              See All Courses
            </div>
          </div>
          <div>
            <p className="text-base text-gray-400">10 courses</p>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
              <div className="bg-white p-0.5">
                <img
                  className="w-24 h-24 rounded-md mt-2 cursor-pointer"
                  title="Friend FullName"
                />
                <div className="font-semibold text-sm">Course FullName</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
