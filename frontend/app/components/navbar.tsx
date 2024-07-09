import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import FlyoutMenu from "../components/flyout-menu";
import Notifications from "../components/notifications";

import logo from "@/assets/logo.png";
import { HiMiniBell } from "react-icons/hi2";

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const router = useRouter();

  // TODO: Implement logout functionality
  const handleLogout = () => {
    Cookies.remove("authToken");
    router.push("/login");
  };

  const links = [
    {
      id: 1,
      name: "notifications",
      link: "notifications",
    },
    {
      id: 2,
      name: "menu",
      link: "menu",
    },
  ];

  const handleMenuClick = (menu: any) => {
    setCurrentMenu(currentMenu === menu ? null : menu);
  };

  const handleLinkClick = () => {
    setCurrentMenu(null);
    setNav(false);
  };

  return (
    <div className="flex justify-between items-center w-full h-20 px-4 text-black bg-white nav">
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Image
            className="hover:transition ease-in-out delay-150 hover:decoration-solid"
            src={logo}
            alt="logo"
            width={50}
            height={50}
          />
        </h1>
      </div>

      <ul className="hidden md:flex items-center">
        {links.map(({ id, name, link }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 link-underline"
            onClick={() => handleMenuClick(link)}
          >
            {link === "menu" ? (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                >
                  <u>Menu</u>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className={`h-5 w-5 transform transition-transform duration-300 ${
                      currentMenu === "menu" ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0
                      111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <FlyoutMenu
                  isOpen={currentMenu === "menu"}
                  // TODO: Cagri please check these
                  onClose={() => setCurrentMenu(null)}
                />
              </>
            ) : link === "notifications" ? (
              <>
                <button
                  type="button"
                  className="text-lm font-medium text-black flex items-center space-x-1"
                  title="Notifications"
                >
                  <HiMiniBell className="h-5 w-5" />
                </button>
                <Notifications
                  isOpen={currentMenu === "notifications"}
                  // TODO: Cagri please check these
                  onClose={() => setCurrentMenu(null)}
                />
              </>
            ) : (
              <Link href={`/${link}`}>
                <a
                  className="text-lm font-medium text-black"
                  onClick={handleLinkClick}
                >
                  {name}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Responsive Menu Icon */}
      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {/* Responsive Nav Menu */}
      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-white to-gray-800 text-gray-500">
          {links.map(({ id, name, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
              onClick={() => handleMenuClick(link)}
            >
              {link === "menu" ? (
                <>
                  <button className="text-4xl">Menu</button>
                  <FlyoutMenu
                    isOpen={currentMenu === "menu"}
                    // TODO: Cagri please check these
                    onClose={() => setCurrentMenu(null)}
                  />
                </>
              ) : link === "notifications" ? (
                <>
                  <button className="text-4xl">Notifications</button>
                  <Notifications
                    isOpen={currentMenu === "notifications"}
                    // TODO: Cagri please check these
                    onClose={() => setCurrentMenu(null)}
                  />
                </>
              ) : (
                <Link href={`/${link}`}>
                  <a className="text-4xl" onClick={handleLinkClick}>
                    {name}
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
