"use client";

import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Navbar = () => {
  // State to toggle the application
  const [nav, setNav] = useState(false);
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    Cookies.remove("authToken");
    router.push("/login");
  };

  // Navigation links data
    // TO-DO replace with links
  const links = [
    {
      id: 1,
      link: "profile",
    },
    {
      id: 2,
      link: "logout",
    }
  ];

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

      <ul className="hidden md:flex">
        {links.map(({ id, link }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200 link-underline"
          >
            {link === "logout" ? (
              <a onClick={handleLogout}>{link}</a>
            ) : (
              <Link href={link}>{link}</Link>
            )}
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
          {links.map(({ id, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              {link === "logout" ? (
                <a onClick={() => { setNav(!nav); handleLogout(); }}>{link}</a>
              ) : (
                <Link onClick={() => setNav(!nav)} href={link}>
                  {link}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
