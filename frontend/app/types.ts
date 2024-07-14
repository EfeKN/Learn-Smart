export interface CourseCardParameters {
  course: Course;
}

export interface CreateCourseModalParameters {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  onCourseCreation: () => void;
}

export interface CourseHomepageParameters {}

export interface NotificationsParameters {
  isOpen: boolean;
  onClose: () => void;
}

export interface ForgotPasswordModalParameters {
  closeModal: () => void;
}

export interface CreateChatModalParameters {
  isOpen: boolean;
  closeModal: () => void;
}

export interface FlyoutMenuParameters {
  isOpen: boolean;
  onClose: () => void;
}

export interface FolderListParameters {
  folders: FolderType[];
  handleDrop: (item: FolderType, targetFolder: FolderType) => void;
}

export interface FolderParameters {
  folder: FolderType;
  onDrop: (item: FolderType, folder: FolderType) => void;
  toggleFolder: (folderName: string) => void;
  isOpen: boolean;
}

export interface FolderType {
  name: string;
  folders: FolderType[];
}

export interface Course {
  course_id: string;
  course_name: string;
  course_code: string;
  course_description: string;
  icon_url: string;
}

export interface Message {
  id: number;
  content: string;
  sender: string;
}

export interface Chat {
  id: number;
  title: string;
}

export interface User {
  [key: string]: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
}
