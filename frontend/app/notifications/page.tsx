"use client";

import { useState } from "react";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { Notification } from "../types";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      notification_id: "0",
      notification_title: "Example Title",
      notification_content: "Example Content",
      notification_date: "2024-07-06",
      notification_is_new: false,
    },
  ]);

  function newNotificationCount() {
    return notifications.filter(
      (notification) => notification.notification_is_new
    ).length;
  }

  function isNew(notification_id: string) {
    const index = notifications.findIndex(
      (notification) => notification.notification_id === notification_id
    );
    return notifications[index].notification_is_new;
  }

  function markAllAsRead() {
    setNotifications(
      notifications.map((notification) => {
        return { ...notification, notification_is_new: false };
      })
    );
  }

  function addNewNotification(notification_id: string) {
    setNotifications(
      notifications.map((notification) => {
        if (notification.notification_id === notification_id) {
          return { ...notification, notification_is_new: true };
        }
        return notification;
      })
    );
  }

  function toggleNotification(notification_id: string) {
    setNotifications(
      notifications.map((notification) => {
        if (notification.notification_id === notification_id) {
          return {
            ...notification,
            notification_is_new: !notification.notification_is_new,
          };
        }
        return notification;
      })
    );
  }

  function removeNewNotification(notification_id: string) {
    setNotifications(
      notifications.map((notification) => {
        if (notification.notification_id === notification_id) {
          return { ...notification, notification_is_new: false };
        }
        return notification;
      })
    );
  }

  return (
    <div className="flex flex-col justify-center w-full bg-white rounded-lg absolute shadow-sm">
      <div className="flex flex-row gap-x-6 m-6 justify-center items-center">
        <h1 className="text-4xl font-bold">Notifications</h1>
        <a className="text-3xl bg-black font-bold text-white rounded-lg px-3 my-auto">
          {newNotificationCount()}
        </a>
        <a
          onClick={markAllAsRead}
          className="text-[#868690] m-auto mr-0 cursor-pointer duration-200 hover:text-[#43608c]"
        >
          Mark all as read
        </a>
      </div>

      <ul className="flex flex-col gap-x-3 gap-y-2 m-8">
        {notifications.map((notification: Notification) => (
          <li className="flex items-start cursor-pointer bg-gray-200 p-2 rounded-md">
            <img
              src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80"
              alt=""
              className="h-32 w-32 rounded-md object-cover m-4"
            />
            <div className="m-4">
              <p className="text-xl text-gray-500">
                <time dateTime="2023-03-16">
                  {notification.notification_date}
                </time>
              </p>
              <a
                href="#"
                className="text-2xl font-medium text-gray-900 hover:text-gray-700"
              >
                {notification.notification_title}
              </a>
              <p className="mt-1 text-xl text-gray-500">
                {notification.notification_content}
              </p>
            </div>
            {notification.notification_is_new ? (
              <IoIosNotifications
                size={30}
                onClick={() =>
                  removeNewNotification(notification.notification_id)
                }
              />
            ) : (
              <IoIosNotificationsOutline
                size={30}
                onClick={() => addNewNotification(notification.notification_id)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
