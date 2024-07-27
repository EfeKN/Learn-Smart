import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import ConfirmationModal from "../components/modals/confirmation-modal";
import { printDebugMessage } from "../debugger";
import { Course, CourseCardFlyoutMenuParameters } from "../types";

export default function CourseCardFlyoutMenu({
  isOpen,
  course,
}: CourseCardFlyoutMenuParameters) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>(Cookies.get("authToken") || "");

  if (!isOpen) {
    return null;
  }

  function renderModal(course: Course): JSX.Element {
    if (!isDeleteModalOpen) {
      return <></>;
    }

    const handleDeleteCourse = async () => {
      printDebugMessage("Deleting course", course.course_id);

      await backendAPI
        .delete(`/course/${course.course_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsDeleteModalOpen(false);
          isOpen = false;

          printDebugMessage("Course deleted successfully", response);

          window.location.reload(); // TODO: Replace with a more efficient way to update the UI
        })
        .catch((error) => {
          console.error("Error deleting course:", error);
        });
    };

    return (
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Are you sure you want to delete this course?"
        onConfirm={handleDeleteCourse}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          isOpen = false;
        }}
      />
    );
  }

  return (
    <div className="relative z-20">
      <div
        className="absolute right-0 max-w-md"
        style={{ marginTop: 1.35 + "rem" }}
      >
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="bg-white px-4 py-2 sm:p-4">
            <div className="flex flex-col gap-2">
              <div
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center text-base font-medium text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                <FaTrashAlt className="w-5 h-5 mr-2 text-gray-600 hover:text-gray-900" />
                Delete
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderModal(course)}
    </div>
  );
}
