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
                //value={courseTitle}
                placeholder="Course Title"
                //onChange={(e) => setCourseTitle(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <input
                type="text"
                //value={courseCode}
                placeholder="Course Code"
                //onChange={(e) => setCourseCode(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <input
                type="text"
                //value={instructor}
                placeholder="Instructor"
                //onChange={(e) => setInstructor(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <textarea
                //value={courseDescription}
                placeholder="Course Description"
                //onChange={(e) => setCourseDescription(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1 h-24 resize-none"
              ></textarea>
            </div>
          </div>
          <button
            //onClick={handleCreateCourse}
            className="border-2 bg-white border-black text-black
                    rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"
          >
            Create Course
          </button>
        </div>
      </div>
    </main>
  );
}
