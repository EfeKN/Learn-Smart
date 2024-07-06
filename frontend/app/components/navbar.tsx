// components/Navbar.js
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import FlyoutMenu from '../components/flyout-menu';
import Notifications from '../components/notifications'; // Import Notifications component

import logo from '@/assets/logo.png';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/login');
  };

  const links = [
    {
      id: 1,
      name: 'Notifications',
      link: 'notifications',
    },
    {
      id: 2,
      name: 'Menu',
      link: 'menu',
    },
    // Add other links as needed
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

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center">
        {links.map(({ id, name, link }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 link-underline"
          >
            {link === 'menu' ? (
              <FlyoutMenu />
            ) : link === 'notifications' ? (
              <Notifications />
            ) : (
              <Link href={`/${link}`}>
                <a className="text-lm font-medium text-black">{name}</a>
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
            <li key={id} className="px-4 cursor-pointer capitalize py-6 text-4xl">
              {link === 'menu' ? (
                <FlyoutMenu onClose={() => setNav(false)} />
              ) : link === 'notifications' ? (
                <Notifications />
              ) : (
                <Link onClick={() => setNav(!nav)} href={`/${link}`}>
                  <a className="text-4xl">{name}</a>
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
