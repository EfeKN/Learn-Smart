import logo from "@/assets/logo.png";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { HiMiniBell } from "react-icons/hi2";
import FlyoutMenu from "../components/flyout-menu";
import Notifications from "../components/notifications";

interface NavbarElement {
  id: number;
  name: string;
  link: string;
  component: () => JSX.Element;
}

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  const navbarElements: NavbarElement[] = [
    {
      id: 1,
      name: "notifications",
      link: "notifications",
      component: renderNotifications,
    },
    {
      id: 2,
      name: "menu",
      link: "menu",
      component: renderMenu,
    },
    {
      id: 3,
      name: "logout",
      link: "logout",
      component: renderLogout,
    },
  ];

  function handleMenuClick(menu: any) {
    setCurrentMenu(currentMenu === menu ? null : menu);
  }

  function handleLinkClick() {
    setCurrentMenu(null);
    setNav(false);
  }

  function handleClickOutside(event: any) {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setCurrentMenu(null);
      setNav(false);
    }
  }

  function handleLogout() {
    Cookies.remove("authToken");
    router.push("/login");
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function renderNotifications(): JSX.Element {
    return (
      <div>
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
      </div>
    );
  }

  function renderMenu(): JSX.Element {
    return (
      <div>
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
      </div>
    );
  }

  function renderLogout(): JSX.Element {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="text-lm font-medium text-black"
      >
        Logout
      </button>
    );
  }

  return (
    <div
      className="flex justify-between items-center w-full h-20 px-4 text-black bg-white nav"
      ref={navRef}
    >
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Image
            className="hover:transition ease-in-out delay-150 hover:decoration-solid"
            src={logo}
            alt="logo"
            width={200}
            height={200}
          />
        </h1>
      </div>

      <ul className="hidden md:flex items-center">
        {navbarElements.map(({ id, name, link, component }) => (
          <li
            key={id}
            className="nav-navbarElements px-4 cursor-pointer capitalize font-medium text-gray-500 link-underline"
            onClick={() => handleMenuClick(link)}
          >
            {component()}
          </li>
        ))}
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-white to-gray-800 text-gray-500">
          {navbarElements.map(({ id, name, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
              onClick={() => handleMenuClick(link)}
            >
              {link === "menu" ? (
                <div>
                  <button className="text-4xl" type="button">
                    Menu
                  </button>
                  <FlyoutMenu
                    isOpen={currentMenu === "menu"}
                    // TODO: Cagri please check these
                    onClose={() => setCurrentMenu(null)}
                  />
                </div>
              ) : link === "notifications" ? (
                <div>
                  <button className="text-4xl" type="button">
                    Notifications
                  </button>
                  <Notifications
                    isOpen={currentMenu === "notifications"}
                    // TODO: Cagri please check these
                    onClose={() => setCurrentMenu(null)}
                  />
                </div>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
