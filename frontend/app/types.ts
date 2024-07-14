export interface CourseCardParameters {
  course: Course;
}

export interface CreateCourseModalParameters {
  isOpen: boolean;
  modalTitle: string;
  onClose: () => void;
}

export interface CourseHomepageParameters {}

export interface Course {
  course_id: string;
  course_name: string;
  course_title: string;
  course_description: string;
  course_icon: string;
}
