"use client";

import { useState } from "react";

export default function Notifications() {
  let [newNotifications, setNewNotifications] = useState([0, 1, 2]);

  function newNotificationCount() {
    return newNotifications.length;
  }

  function isNew(id: number) {
    return newNotifications.includes(id);
  }

  function markAllAsRead() {
    setNewNotifications([]);
  }

  function addNewNotification(id: number) {
    setNewNotifications([...newNotifications, id]);
  }

  function toggleNotification(id: number) {
    if (newNotifications.includes(id)) {
      removeNewNotification(id);
    } else {
      addNewNotification(id);
    }
  }

  function removeNewNotification(id: number) {
    setNewNotifications(
      newNotifications.filter((notification) => notification !== id)
    );
  }

  return (
    <div className="flex justify-center w-full m-4 bg-white">
      <div className=" w-full lg:w-[715px] bg-white rounded-lg absolute shadow-sm p-6 justify-center">
        <div className="flex flex-row gap-x-6 mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <a className="bg-black font-bold text-white rounded-lg px-3 my-auto">
            {newNotificationCount()}
          </a>
          <a
            onClick={markAllAsRead}
            className="text-[#868690] m-auto mr-0 cursor-pointer duration-200 hover:text-[#43608c]"
          >
            Mark all as read
          </a>
        </div>

        <div className="flex flex-col gap-x-3 gap-y-2">
          <div
            onClick={() => toggleNotification(0)}
            className={
              isNew(0) == true
                ? "message-container message-container-new"
                : "message-container"
            }
          >
            <img
              className="person-icon"
              src="/images/avatar-mark-webber.webp"
              alt="user icon"
            />
            <div className="ml-4 w-full">
              <a>
                <span className="ml-2 mr-1 message-describe">content</span>
                <span className="person-group-name">content</span>
                <span className={isNew(0) == true ? "new-message-dot" : ""} />
              </a>
              <div className="">
                <p className="message-duration">1m ago</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => toggleNotification(1)}
            className={
              isNew(1) == true
                ? "message-container message-container-new"
                : "message-container"
            }
          >
            <img
              className="person-icon"
              src="/images/avatar-angela-gray.webp"
              alt="user icon"
            />
            <div className="ml-4 w-full">
              <a>
                <span className="ml-2 message-describe">content</span>
                <span className={isNew(1) == true ? "new-message-dot" : ""} />
              </a>
              <div className="">
                <p className="message-duration">5m ago</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => toggleNotification(2)}
            className={
              isNew(2) == true
                ? "message-container message-container-new"
                : "message-container"
            }
          >
            <img
              className="person-icon"
              src="/images/avatar-jacob-thompson.webp"
              alt="user icon"
            />
            <div className="ml-4 w-full">
              <a className="gap-x-2">
                <span className="ml-2 mr-1 message-describe">content</span>
                <span className={isNew(2) == true ? "new-message-dot" : ""} />
              </a>
              <div className="">
                <p className="message-duration">1m ago</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => toggleNotification(3)}
            className={
              isNew(3) == true
                ? "message-container message-container-new"
                : "message-container"
            }
          >
            <img
              className="person-icon mt-0"
              src="/images/avatar-rizky-hasanuddin.webp"
              alt="user icon"
            />
            <div className="ml-4 w-full">
              <a>
                <span className="ml-2">content</span>
                <span className={isNew(3) == true ? "new-message-dot" : ""} />
              </a>
              <div className="">
                <p className="message-duration">5 days ago</p>
              </div>
              <div className="">
                <p className="text-[#73757f] p-3 mt-3 duration-150 hover:bg-[#e4eff9] hover:border-[#e4eff9] border-[##eff1f3] border-2 rounded-lg">
                  content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
