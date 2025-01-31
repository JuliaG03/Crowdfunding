import React, { useState } from 'react';
import { Menu } from '../icons/Icons';
import logo from '../logo.svg';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div>
      <nav className="bg-darkgreen">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-babypowder hover:bg-darkgreen focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu />
              </button>
            </div>

            {/* Logo and Title */}
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <h4 className="font-mono text-xl text-babypowder hidden lg:block">
                  Crowdfunding
                </h4>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-8">
                <a
                  href="#"
                  className="bg-darkgreen text-babypowder px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-babypowder hover:bg-darkgreen hover:text-babypowder px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Contribution
                </a>
                <a
                  href="#"
                  className="text-babypowder hover:bg-darkgreen hover:text-babypowder px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Fundraising
                </a>
              </div>
            </div>

            {/* Profile and Notifications */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="bg-darkgreen p-1 rounded-full text-babypowder font-medium hover:text-babypowder focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkgreen focus:ring-white"
              >
                <span>View notifications</span>
              </button>

              {/* Profile Dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-darkgreen flex text-sm rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-darkgreen focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={logo} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden ${!openMenu ? 'hidden' : ''}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="bg-darkgreen text-babypowder block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-babypowder hover:bg-darkgreen hover:text-babypowder block px-3 py-2 rounded-md text-base font-medium"
            >
              Team
            </a>
            <a
              href="#"
              className="text-babypowder hover:bg-darkgreen hover:text-babypowder block px-3 py-2 rounded-md text-base font-medium"
            >
              Projects
            </a>
            <a
              href="#"
              className="text-babypowder hover:bg-darkgreen hover:text-babypowder block px-3 py-2 rounded-md text-base font-medium"
            >
              Calendar
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
