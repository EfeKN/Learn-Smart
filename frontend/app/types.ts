import React from "react";

export interface CourseCardParameters {
  course: Course;
}

export interface LoadingButtonParameters {
  type: "button" | "submit" | "reset";
  text: string;
  loadingText: string;
  disabled: boolean;
  className: string;
  handleClick: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
}

export interface CreateCourseModalParameters {
  isOpen: boolean;
  modalTitle: string;
  onClose: () => void;
  onCourseCreation: () => void;
}

export interface CourseHomepageParameters {}

export interface NavbarNotificationsFlyoutMenuParameters {
  isOpen: boolean;
  onClose: () => void;
}

export interface ForgotPasswordModalParameters {
  closeModal: () => void;
}

export interface CreateChatModalParameters {
  authToken: string;
  isOpen: boolean;
  closeModal: () => void;
  onChatCreated: (chat: Chat) => void;
}

export interface NavbarFlyoutMenuParameters {
  isOpen: boolean;
  onClose: () => void;
}

export interface MarkdownContentProps {
  markdown_content: string;
}

export interface FolderListParameters {
  folders: FolderType[];
  handleDrop: (item: FolderType, targetFolder: FolderType) => void;
}

export interface FolderParameters {
  folder: FolderType;
  isOpen: boolean;
  onDrop: (item: FolderType, folder: FolderType) => void;
  toggleFolder: (folderName: string) => void;
}

export interface ConfirmationModalParameters {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CourseCardFlyoutMenuParameters {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
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
  course_icon_url: string;
}

export interface ChatFieldProps {
  selectedChat: Chat;
  token: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLastMessageID: React.Dispatch<React.SetStateAction<number>>;
  lastMessageID: number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UploadChoiceModalProps {
  isOpen: boolean;
  selectedChat: Chat;
  token: string;
  onClose: () => void;
  onChatUpdated: (chat: any) => void;
  onUploadFile: (file: File) => void;
}
export interface Message {
  text: string;
  role: string;
  message_id: number;
  media_url: any;
}

export interface User {
  [key: string]: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
}

export interface NavbarElement {
  navbar_element_id: number;
  navbar_element_name: string;
  navbar_element_link: string;
  navbar_element_component: () => JSX.Element;
}

export interface CourseHomepageElement {
  course_homepage_element_explanation: string;
  course_homepage_element_name: string;
  course_homepage_element_router: JSX.Element;
  course_homepage_element_component: JSX.Element;
}

export interface Chat {
  chat_id: string;
  chat_title: string;
  slides_mode: boolean;
}

export interface Notification {
  notification_id: string;
  notification_title: string;
  notification_content: string;
  notification_date: string;
  notification_is_new: boolean;
}
