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

export interface NotificationsParameters {
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

export interface FlyoutMenuParameters {
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

export interface ChatFieldProps {
    selectedChat: { chat_id: string } | null;
    token: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setLastMessageID: React.Dispatch<React.SetStateAction<number>>;
    lastMessageID: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UploadChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedChat: {
        chat_id: string;
        chat_title: string;
        course_id: string;
    };  // Adjust type according to your actual type
    token: string;
    onChatUpdated: (chat: any) => void;  // Adjust type according to your actual type
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
