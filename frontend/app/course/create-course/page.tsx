"use client";
// Write Under Modals
export default function CreateCourse() {
  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
      <div className="bg-white text-black rounded-2xl shadow-2xl flex w-3/4 h-3/4">
        <div className="w-full h-full p-5">
          <div className="py-5">
            <h2 className="text-3xl font-bold text-black-500 mb-2">
              Create a Course
            </h2>
          </div>
          <div className="border-2 w-10 border-black inline-block mb-2"></div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <input
                type="text"
                placeholder="Course Title"
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <input
                type="text"
                placeholder="Course Code"
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <input
                type="text"
                placeholder="Instructor"
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <textarea
                placeholder="Course Description"
                className="ml-1 bg-gray-100 outline-none text-sm flex-1 h-24 resize-none"
              ></textarea>
            </div>
          </div>
          <button
            className="border-2 bg-white border-black text-black
                    rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"
            type="button"
          >
            Create Course
          </button>
        </div>
      </div>
    </main>
  );
}
